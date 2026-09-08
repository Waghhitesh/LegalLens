const TOKEN_KEY = "ll_token";
const ROLE_KEY = "ll_role";
const USER_KEY = "ll_user";

export function setAuth(token, role, username) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USER_KEY, username);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

export function getUsername() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
}

export const ROLES = [
  { value: "CITIZEN", label: "Citizen" },
  { value: "SHOPKEEPER", label: "Shopkeeper" },
  { value: "COMPANY", label: "Company" },
  { value: "GOVERNMENT_OFFICIAL", label: "Government Official" },
  { value: "ADMIN", label: "Admin" },
];
