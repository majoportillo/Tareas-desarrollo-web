
/** Resultado de analizar una URL. */
export interface UrlParts {
  /** Protocolo tal como lo devuelve la WHATWG URL, p. ej. "https:". */
  protocol: string;
  /** Host (puede incluir puerto), p. ej. "api.ejemplo.com:443". */
  host: string;
  /** Ruta, p. ej. "/users". */
  pathname: string;
  /** Query string con el "?" inicial, p. ej. "?id=1&name=Ana". */
  search: string;
  /** Lista de pares [clave, valor] de los query params. */
  query: Array<[string, string]>;
}

export type StatusCategory =
  | "1xx Informativo"
  | "2xx Éxito"
  | "3xx Redirección"
  | "4xx Error del cliente"
  | "5xx Error del servidor"
  | "Desconocido";

export type Headers = Record<string, string>;


export function parseUrl(url: string): UrlParts {
  const u = new URL(url);
  return {
    protocol: u.protocol,
    host: u.host,
    pathname: u.pathname,
    search: u.search,
    query: Array.from(u.searchParams.entries()),
  };
}

/**
 * TODO: Clasifica un código de estado HTTP en su categoría.
 *
 * Reglas:
 *   100–199 → "1xx Informativo"
 *   200–299 → "2xx Éxito"
 *   300–399 → "3xx Redirección"
 *   400–499 → "4xx Error del cliente"
 *   500–599 → "5xx Error del servidor"
 *   otro    → "Desconocido"
 *
 * Pista: un único `if / else if` con comparaciones de rangos basta.
 */
export function classifyStatus(code: number): StatusCategory {
  if (code >= 100 && code < 200) return "1xx Informativo";
  if (code >= 200 && code < 300) return "2xx Éxito";
  if (code >= 300 && code < 400) return "3xx Redirección";
  if (code >= 400 && code < 500) return "4xx Error del cliente";
  if (code >= 500 && code < 600) return "5xx Error del servidor";
  return "Desconocido";
}

export function parseHeaders(text: string): Headers {
  const headers: Headers = {};
  const lines = text.split("\n");

  for (const line of lines) {
    if (!line.includes(":")) continue;

    const separatorIndex = line.indexOf(":");
    const name = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (name === "") continue;

    headers[name] = value;
  }

  return headers;
}

export function summarizeRequest(
  url: string,
  status: number,
  headersText: string,
): string {
  const category = classifyStatus(status);
  const headers = parseHeaders(headersText);

  const headerLines = Object.entries(headers)
    .map(([name, value]) => `  • ${name}: ${value}`)
    .join("\n");

  return [
    "Resumen de la petición",
    "──────────────────────",
    `URL:     ${url}`,
    `Status:  ${status} (${category})`,
    "Headers:",
    headerLines,
  ].join("\n");
}
// ---------------------------------------------------------------------------
// CLI 
// ---------------------------------------------------------------------------

if (require.main === module) {
  const [, , cmd, ...args] = process.argv;
  try {
    if (cmd === "parse-url" && args[0]) {
      const parts = parseUrl(args[0]);
      console.log(JSON.stringify(parts, null, 2));
    } else if (cmd === "status" && args[0]) {
      const cat = classifyStatus(Number(args[0]));
      console.log(cat);
    } else if (cmd === "headers" && args.length > 0) {
      const h = parseHeaders(args.join(" "));
      console.log(JSON.stringify(h, null, 2));
    } else if (cmd === "summary" && args.length >= 2) {
      const [url, status, ...rest] = args;
      console.log(summarizeRequest(url, Number(status), rest.join(" ")));
    } else {
      console.log("Uso:");
      console.log('  npm start parse-url "https://ejemplo.com/path?a=1"');
      console.log("  npm start status 404");
      console.log('  npm start headers "Content-Type: application/json"');
      console.log('  npm start summary "https://x.com" 200 "Content-Type: application/json"');
    }
  } catch (e) {
    console.error("Error:", (e as Error).message);
    process.exit(1);
  }
}
