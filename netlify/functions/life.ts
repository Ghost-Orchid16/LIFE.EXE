import { handleLifeRequest } from "../../server/handler.ts";

// Netlify Function (v2 API) that serves the LIFE.EXE API at /api/life.
// Environment variables (GEMINI_API_KEY, GEMINI_MODEL) come from the site's configuration.
export default (request: Request) => handleLifeRequest(request, process.env);

export const config = {
  path: "/api/life",
};
