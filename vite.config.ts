import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import { handleLifeRequest } from "./server/handler.ts";
import { runFetchHandler } from "./server/node-adapter.ts";
import { API_PATH } from "./shared/contract.ts";

/**
 * Serves the same API handler as the Netlify Function during `npm run dev` and `npm run preview`,
 * so the whole app runs locally with a single command. Server variables such as AI_API_KEY are
 * read from `.env` here and are never exposed to the browser bundle.
 */
function lifeApi(): Plugin {
  let env: Record<string, string | undefined> = {};

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    if (req.url?.split("?")[0] !== API_PATH) return next();
    runFetchHandler(req, res, (request) => handleLifeRequest(request, env)).catch(next);
  };

  return {
    name: "life-exe-api",
    configResolved(config) {
      env = loadEnv(config.mode, config.envDir, "");
    },
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), lifeApi()],
});
