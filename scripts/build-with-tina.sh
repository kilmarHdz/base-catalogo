#!/usr/bin/env bash
set -euo pipefail

# Build script que orquesta Tina local + Astro build.
# Tina local debe estar corriendo en :4001 para que el cliente generado pueda
# hacer las queries en build-time. Lo levantamos en background, esperamos a que
# esté listo, hacemos astro build, y matamos el server.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

cleanup() {
  if [[ -n "${TINA_PID:-}" ]] && kill -0 "$TINA_PID" 2>/dev/null; then
    kill "$TINA_PID" 2>/dev/null || true
    wait "$TINA_PID" 2>/dev/null || true
  fi
  lsof -ti:4001 2>/dev/null | xargs -r kill 2>/dev/null || true
}
trap cleanup EXIT

echo "▶  Generando cliente Tina (modo local)..."
# La indexación local de Tina es intensiva en memoria y agota el heap por
# defecto de Node en contenedores de build con RAM limitada (p. ej. Cloudflare
# Pages). Se sube el límite del heap solo para este paso.
NODE_OPTIONS="--max-old-space-size=6144" pnpm exec tinacms build --local --skip-cloud-checks

echo "▶  Levantando Tina GraphQL server en :4001..."
pnpm exec tinacms dev >/tmp/tina-build.log 2>&1 &
TINA_PID=$!

# Esperar a que el server responda
for i in {1..30}; do
  if curl -fsS http://localhost:4001/graphql -X POST -H "Content-Type: application/json" -d '{"query":"{ __typename }"}' >/dev/null 2>&1; then
    echo "   Tina listo (intento $i)"
    break
  fi
  sleep 1
  if [[ $i -eq 30 ]]; then
    echo "✖  Tina server no respondió en 30s"
    cat /tmp/tina-build.log
    exit 1
  fi
done

echo "▶  Compilando Astro..."
pnpm exec astro build

echo "✓  Build completo"
