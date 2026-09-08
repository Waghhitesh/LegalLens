"use client";
import { useState, useEffect, useRef } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    async function fetchNotifs() {
      try {
        const res = await fetch("http://localhost:8000/api/v1/notifications", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setCount(data.unread || 0);
        }
      } catch {}
    }
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
          <div className="bg-navy px-4 py-3 flex items-center justify-between">
            <p className="text-white text-sm font-semibold">🔔 Violation Alerts</p>
            <span className="text-xs text-slate-400">{count} unread</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-sm text-slate-500">No recent violations</p>
              </div>
            ) : notifications.map((n, i) => (
              <div key={i} className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${n.severity === "HIGH" ? "bg-red-500" : "bg-amber-500"}`}></span>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{n.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">📍 {n.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-slate-100">
            <a href="/violations" className="text-xs text-blue-600 font-semibold hover:underline">View all violations →</a>
          </div>
        </div>
      )}
    </div>
  );
}
