const API_BASE_URL = "";

function getToken() {
  return localStorage.getItem("accessToken");
}

function setAuth(data) {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("currentUser", JSON.stringify(data.user));
}

function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("currentUser");
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  let body = null;
  try {
    body = await response.json();
  } catch (_) {}

  if (!response.ok) {
    if (response.status === 401) clearAuth();

    const validationErrors = Array.isArray(body?.errors)
      ? body.errors
          .map((err) => err?.msg || err?.message)
          .filter(Boolean)
      : [];

    const details = validationErrors.join(" | ");
    throw new Error(details || body?.message || `Request failed (${response.status})`);
  }

  return body;
}

window.todoAuth = { getToken, setAuth, clearAuth, getCurrentUser, apiRequest };
