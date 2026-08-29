import type { NextConfig } from "next";

// LIFE.EXE ships as a static export for GitHub Pages (project site served
// from /LIFE.EXE/, not the domain root), so every internal path needs the
// basePath prefix and directory-style URLs (trailingSlash) that GitHub's
// static file server expects. Deploying somewhere with a real Node server
// instead (Vercel, etc.) just means dropping these three lines.
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGithubPages ? "/LIFE.EXE" : "",
  assetPrefix: isGithubPages ? "/LIFE.EXE/" : "",
  trailingSlash: true,
};

export default nextConfig;
