export const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) throw new Error("Request failed");
  return response.json();
}

export function productImage(path?: string) {
  if (!path) return "https://shop.muiz.tech/assets/products/tape-details-large.png";
  if (path.startsWith("http")) return path;
  return "https://shop.muiz.tech/assets/" + path;
}
