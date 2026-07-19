#!/usr/bin/env bash
set -euo pipefail

# Build script que orquesta Tina + Astro build.
#
# Si TINA_CLIENT_ID y TINA_TOKEN están definidos, usa Tina Cloud: el cliente
# generado consulta la API hospedada de Tina Cloud en build-time, no hace
# falta levantar ningún servidor local.
#
# Si no, cae a modo local: Tina local debe estar corriendo en :4001 para que
# el cliente generado pueda hacer las queries en build-time. Lo levantamos en
# background, esperamos a que esté listo, hacemos astro build, y matamos el
# server.

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

# La indexación de Tina es intensiva en memoria y agota el heap por defecto
# de Node en contenedores de build con RAM limitada (p. ej. Cloudflare
# Pages). Se sube el límite del heap para ambos modos.
export NODE_OPTIONS="--max-old-space-size=6144"

if [[ -n "${TINA_CLIENT_ID:-}" && -n "${TINA_TOKEN:-}" ]]; then
  echo "▶  Generando cliente Tina (modo Tina Cloud)..."
  pnpm exec tinacms build

  echo "▶  Compilando Astro..."
  pnpm exec astro build
else
  echo "▶  TINA_CLIENT_ID/TINA_TOKEN no definidos: usando modo local."
  echo "▶  Generando cliente Tina (modo local)..."
  pnpm exec tinacms build --local --skip-cloud-checks

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
fi

echo "✓  Build completo"
