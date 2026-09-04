import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// A 401 means the token expired or was revoked; send the user back to login
// rather than leaving the page stuck on a spinner.
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !location.pathname.startsWith("/login")) {
      localStorage.removeItem("token");
      location.assign("/login");
    }
    return Promise.reject(err);
  }
);

// ─── Auth ─────────────────────────────────────────────
export function loginUser(username, password) {
  return API.post("/login", { username, password });
}

// ─── Corpus (read-only) ───────────────────────────────
export function getStats() {
  return API.get("/stats");
}

export function getCategories() {
  return API.get("/categories");
}

export function getCategory(slug) {
  return API.get(`/categories/${slug}`);
}

export function getCategoryInfo(slug) {
  return API.get(`/categories/${slug}/info`);
}

export function refreshCatalogue() {
  return API.post("/refresh");
}
