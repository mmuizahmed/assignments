export const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const LOGIN_PATH = "/assignment/berry-dashboard/login/";

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const response = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
      ...(options?.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.replace(LOGIN_PATH);
  }
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(API + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Could not log in");
  localStorage.setItem("token", data.token);
}

export function logout() {
  localStorage.removeItem("token");
  window.location.replace(LOGIN_PATH);
}

export function productImage(path?: string) {
  if (!path) return "https://shop.muiz.tech/assets/products/tape-details-large.png";
  if (path.startsWith("http")) return path;
  return "https://shop.muiz.tech/assets/" + path;
}
