import type { IncomingMessage, ServerResponse } from "node:http";

async function readBody(req: IncomingMessage): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) chunks.push(chunk as Uint8Array);
  return Buffer.concat(chunks);
}

/**
 * Runs a Fetch-style handler (Request → Response) on a Node http request.
 * Used to serve the API from the Vite dev and preview servers; Netlify calls the handler directly.
 */
export async function runFetchHandler(
  req: IncomingMessage,
  res: ServerResponse,
  handler: (request: Request) => Promise<Response>,
): Promise<void> {
  const abort = new AbortController();
  res.on("close", () => {
    if (!res.writableFinished) abort.abort();
  });

  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) value.forEach((v) => headers.append(name, v));
    else if (value !== undefined) headers.set(name, value);
  }

  const method = req.method ?? "GET";
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const body = method === "GET" || method === "HEAD" ? undefined : await readBody(req);
  const response = await handler(new Request(url, { method, headers, body, signal: abort.signal }));

  res.statusCode = response.status;
  response.headers.forEach((value, name) => res.setHeader(name, value));
  if (!response.body) {
    res.end();
    return;
  }

  res.flushHeaders();
  const reader = response.body.getReader();
  try {
    while (!res.destroyed) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  } finally {
    if (res.destroyed) await reader.cancel();
    res.end();
  }
}
