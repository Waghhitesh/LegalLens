"use client";

import { useState, useEffect } from "react";
import TopNav from "../../components/TopNav";
import { fetchUsers, updateUser, deleteUser, exportUsersUrl } from "../../lib/api";
import { getRole } from "../../lib/auth";
import { DEMO_INSPECTIONS } from "../../lib/demoData";

const DEMO_USERS = [
  { id: "u1", username: "r.sharma", email: "rsharma@legalmetrology.gov.in", role: "ADMIN", full_name: "Rajesh Sharma", is_active: true, created_at: "2026-08-01" },
  { id: "u2", username: "p.verma", email: "pverma@legalmetrology.gov.in", role: "GOVERNMENT_OFFICIAL", full_name: "Priya Verma", is_active: true, created_at: "2026-08-05" },
  { id: "u3", username: "a.gupta", email: "agupta@legalmetrology.gov.in", role: "GOVERNMENT_OFFICIAL", full_name: "Amit Gupta", is_active: true, created_at: "2026-08-10" },
  { id: "u4", username: "manufacturer1", email: "quality@bharatfoods.in", role: "COMPANY", full_name: "Bharat Foods QC", is_active: true, created_at: "2026-08-15" },
  { id: "u5", username: "citizen1", email: "consumer@gmail.com", role: "CITIZEN", full_name: "Ananya Patel", is_active: true, created_at: "2026-08-20" },
  { id: "u6", username: "shop.owner", email: "shop@example.com", role: "SHOPKEEPER", full_name: "Vikram Singh", is_active: false, created_at: "2026-08-25" },
];

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [useDemo, setUseDemo] = useState(false);
  const [tab, setTab] = useState("users");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchUsers();
        if (data.length > 0) setUsers(data);
        else { setUsers(DEMO_USERS); setUseDemo(true); }
      } catch { setUsers(DEMO_USERS); setUseDemo(true); }
    }
    load();
  }, []);

  async function toggleActive(user) {
    if (useDemo) {
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
      return;
    }
    try {
      await updateUser(user.id, { is_active: !user.is_active });
      setUsers(users.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
    } catch {}
  }

  const ROLE_COLORS = {
    ADMIN: "bg-red-100 text-red-700",
    GOVERNMENT_OFFICIAL: "bg-blue-100 text-blue-700",
    COMPANY: "bg-purple-100 text-purple-700",
    CITIZEN: "bg-green-100 text-green-700",
    SHOPKEEPER: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="page-enter">
      <TopNav title="Admin Panel" subtitle="System administration and user management" />
      <div className="p-6 space-y-6">
        {/* Tab Nav */}
        <div className="flex gap-2">
          {["users", "audit-log", "system"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-navy text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}>{t === "users" ? "👥 Users" : t === "audit-log" ? "📋 Audit Log" : "⚙️ System"}</button>
          ))}
          {!useDemo && (
            <a href={exportUsersUrl("csv")} target="_blank"
              className="ml-auto btn-outline text-sm flex items-center gap-2">📥 Export CSV</a>
          )}
        </div>

        {/* Users Tab */}
        {tab === "users" && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="table-header">User</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Role</th>
                    <th className="table-header">Created</th>
                    <th className="table-header">Status</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {(u.full_name || u.username || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{u.full_name || u.username}</p>
                            <p className="text-[10px] text-slate-400">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-sm text-slate-600">{u.email || "—"}</td>
                      <td className="table-cell">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[u.role] || "bg-slate-100 text-slate-600"}`}>
                          {u.role?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="table-cell text-sm text-slate-500">{typeof u.created_at === 'string' ? u.created_at : new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="table-cell">
                        <button onClick={() => toggleActive(u)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            u.is_active ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                          }`}>{u.is_active ? "✓ Active" : "✕ Disabled"}</button>
                      </td>
                      <td className="table-cell">
                        <button className="text-blue-600 text-xs font-semibold hover:underline mr-3">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Log Tab */}
        {tab === "audit-log" && (
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-4">System Audit Trail</h3>
            <div className="space-y-3">
              {DEMO_INSPECTIONS.slice(0, 8).map((ins, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs">📋</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Inspection <span className="font-mono text-xs text-slate-500">{ins.id}</span></p>
                    <p className="text-xs text-slate-400">{ins.inspector} · {ins.date}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    ins.status === "compliant" ? "bg-green-50 text-green-700" :
                    ins.status === "flagged" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                  }`}>{ins.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Tab */}
        {tab === "system" && (
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-700 mb-4">System Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Version</p>
                <p className="text-lg font-bold text-slate-700">2.0.0</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Backend</p>
                <p className="text-lg font-bold text-green-600">● Online</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400">Database</p>
                <p className="text-lg font-bold text-slate-700">SQLite</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-400">AI Model</p>
                <p className="text-lg font-bold text-slate-700">llava (Ollama)</p>
              </div>
            </div>
          </div>
        )}

        {useDemo && <p className="text-center text-xs text-slate-400 py-2">💡 Showing demo data. Connect backend for live user management.</p>}
      </div>
    </div>
  );
}
