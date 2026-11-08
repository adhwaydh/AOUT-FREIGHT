// Central API base URL for local development and deployed environments.
// Vercel Production and Preview can override this with VITE_API_URL.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL = (
  configuredApiUrl || "https://aout-freight-api.onrender.com"
).replace(/\/+$/, "");
