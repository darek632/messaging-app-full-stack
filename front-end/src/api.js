const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";

  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // token expired or invalid sends back to login
    if (res.status === 401 && token) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || data.errors?.[0]?.msg || "Something went wrong");
    error.status = res.status;
    throw error;
  }

  return data;
}

export function startConversation(recipientId) {
  return apiFetch("/conversations", { method: "POST", body: { recipientId } });
}
