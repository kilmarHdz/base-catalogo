/**
 * Acceso tipado y validado a las variables de entorno.
 *
 * Las variables `PUBLIC_*` se exponen al cliente (import.meta.env.PUBLIC_*).
 * El resto solo está disponible en build/server.
 *
 * Si una variable crítica falta, este módulo lanza un warning en consola
 * pero no rompe el build (los consumidores deciden cómo manejarlo).
 */

interface EnvShape {
  PUBLIC_WEB3FORMS_KEY: string | undefined;
  TINA_CLIENT_ID: string | undefined;
  TINA_TOKEN: string | undefined;
}

const env: EnvShape = {
  PUBLIC_WEB3FORMS_KEY: import.meta.env.PUBLIC_WEB3FORMS_KEY as string | undefined,
  TINA_CLIENT_ID: import.meta.env.TINA_CLIENT_ID as string | undefined,
  TINA_TOKEN: import.meta.env.TINA_TOKEN as string | undefined,
};

/**
 * Indica si la integración con Web3Forms está configurada.
 * Si es false, el form de contacto mostrará un error al intentar enviar.
 */
export function isWeb3FormsConfigured(): boolean {
  const key = env.PUBLIC_WEB3FORMS_KEY;
  return typeof key === 'string' && key.trim().length > 0;
}

export function getWeb3FormsKey(): string | undefined {
  return env.PUBLIC_WEB3FORMS_KEY;
}

/**
 * Valida la configuración al cargar el módulo.
 * Solo emite warnings en consola (no detiene la ejecución).
 */
if (typeof window === 'undefined') {
  if (!env.PUBLIC_WEB3FORMS_KEY) {
    console.warn(
      '[site] PUBLIC_WEB3FORMS_KEY no está definida. El formulario de contacto no podrá enviar mensajes hasta que la configures en .env. Ver .env.example.'
    );
  }
}

export default env;
