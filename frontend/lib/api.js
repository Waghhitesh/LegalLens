import axios from "axios";
import { getToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Audit
export async function submitUrlAudit(url) {
  const { data } = await api.post("/api/v1/audit/url", { url });
  return data;
}
export async function getAudit(auditId) {
  const { data } = await api.get(`/api/v1/audit/${auditId}`);
  return data;
}
export function downloadLegalNoticeUrl(auditId) {
  return `${API_BASE_URL}/api/v1/audit/${auditId}/report`;
}
export function resolveMediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}
export async function submitUploadAudit(file, barcode = "") {
  const form = new FormData();
  form.append("file", file);
  if (barcode) form.append("barcode", barcode);
  const { data } = await api.post("/api/v1/audit/upload", form);
  return data;
}
export async function submitBulkUpload(files) {
  const form = new FormData();
  files.forEach((f) => form.append("images", f));
  const { data } = await api.post("/api/v1/audit/bulk-upload", form);
  return data;
}

// Dashboard
export async function getDashboardStats() {
  const { data } = await api.get("/api/v1/dashboard/stats");
  return data;
}
export async function getRecentAudits(limit = 10) {
  const { data } = await api.get(`/api/v1/dashboard/recent-audits?limit=${limit}`);
  return data;
}

// Auth
export async function requestOtp(target, purpose = "register") {
  const { data } = await api.post("/api/v1/auth/otp/request", { target, purpose });
  return data;
}
export async function verifyOtp(target, code, purpose = "register") {
  const { data } = await api.post("/api/v1/auth/otp/verify", { target, code, purpose });
  return data;
}
export async function registerUser(payload) {
  const { data } = await api.post("/api/v1/auth/register", payload);
  return data;
}
export async function loginUser(username, password) {
  const { data } = await api.post("/api/v1/auth/login", { username, password });
  return data;
}
export async function fetchMe() {
  const { data } = await api.get("/api/v1/auth/me");
  return data;
}

// Users (Admin)
export async function fetchUsers() {
  const { data } = await api.get("/api/v1/users");
  return data;
}
export async function updateUser(userId, payload) {
  const { data } = await api.patch(`/api/v1/users/${userId}`, payload);
  return data;
}
export async function deleteUser(userId) {
  await api.delete(`/api/v1/users/${userId}`);
}
export function exportUsersUrl(fmt = "csv") {
  return `${API_BASE_URL}/api/v1/users/export/${fmt}`;
}

// Agent / Ollama
export async function agentChat(message, history = []) {
  const { data } = await api.post("/api/v1/agent/chat", { message, history });
  return data;
}
export async function agentAnalyzeImage(file) {
  const form = new FormData();
  form.append("image", file);
  const { data } = await api.post("/api/v1/agent/analyze-image", form);
  return data;
}
