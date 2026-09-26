import { handleLifeRequest } from "../../server/handler.ts";

// Netlify Function (v2 API) that serves the LIFE.EXE API at /api/life.
// Environment variables (AI_API_KEY, AI_MODEL, AI_EFFORT) come from the site's configuration.
export default (request: Request) => handleLifeRequest(request, process.env);

export const config = {
  path: "/api/life",
};
