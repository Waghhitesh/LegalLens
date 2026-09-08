// D:\sih-legal-metrology\frontend\lib\api.js

const API_BASE = "http://localhost:8000";

function getHeaders(isFormData = false) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

export async function loginUser(username, password) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(error.detail || "Login failed");
  }
  return res.json();
}

export async function registerDirect(userData) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register-direct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(error.detail || "Registration failed");
  }
  return res.json();
}

export async function requestOtp(target, purpose) {
  const res = await fetch(`${API_BASE}/api/v1/auth/otp/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, purpose }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to request OTP" }));
    throw new Error(error.detail || "Failed to request OTP");
  }
  return res.json();
}

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Registration failed" }));
    throw new Error(error.detail || "Registration failed");
  }
  return res.json();
}

export async function agentChat(message, history) {
  const res = await fetch(`${API_BASE}/api/v1/agent/chat`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Chat failed" }));
    throw new Error(error.detail || "Chat failed");
  }
  return res.json();
}

export async function agentAnalyzeImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await fetch(`${API_BASE}/api/v1/agent/analyze-image`, {
    method: "POST",
    headers: getHeaders(true),
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Image analysis failed" }));
    throw new Error(error.detail || "Image analysis failed");
  }
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/api/v1/users`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to fetch users" }));
    throw new Error(error.detail || "Failed to fetch users");
  }
  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_BASE}/api/v1/users/${id}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to update user" }));
    throw new Error(error.detail || "Failed to update user");
  }
  return res.json();
}

export function exportUsersUrl(format) {
  return `${API_BASE}/api/v1/users/export?format=${format}`;
}

export async function getNotifications() {
  const res = await fetch(`${API_BASE}/api/v1/notifications`, {
    method: "GET",
    headers: getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Failed to fetch notifications" }));
    throw new Error(error.detail || "Failed to fetch notifications");
  }
  return res.json();
}
