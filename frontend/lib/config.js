// Central API URL config - automatically uses correct hostname for mobile access
export function getApiUrl() {
  // 1. If explicitly set via env var, use that
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  // 2. In browser, use current hostname (works on mobile via WiFi!)
  if (typeof window !== 'undefined') {
    return "http://" + window.location.hostname + ":8000";
  }
  // 3. Server-side fallback
  return "http://localhost:8000";
}
