// Central API base URL for local development and Vercel production.
// Set VITE_API_URL in the Vercel frontend project to the deployed backend URL.
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_URL = (
  configuredApiUrl || "http://127.0.0.1:8000"
).replace(/\/+$/, "");
