"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchUsers, updateUser, deleteUser, exportUsersUrl } from "../../lib/api";
import { getRole, isLoggedIn, ROLES } from "../../lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!isLoggedIn() || getRole() !== "ADMIN") {
      router.replace("/login?role=ADMIN");
      return;
    }
    load();
  }, []);

  async function load() {
    try {
      setUsers(await fetchUsers());
    } catch (err) {
      setError(err.response?.data?.detail || "Could not load users");
    }
  }

  async function handleRoleChange(id, role) {
    setSavingId(id);
    try {
      const updated = await updateUser(id, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } finally {
      setSavingId(null);
    }
  }

  async function handleToggleActive(id, is_active) {
    setSavingId(id);
    try {
      const updated = await updateUser(id, { is_active });
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this user permanently?")) return;
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <main className="page-shell max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="font-ui text-xs uppercase tracking-wider text-gold mb-1">Admin</p>
          <h1 className="font-display text-3xl text-navy">Registered Users</h1>
        </div>
        <div className="flex gap-2">
          <a
            href={exportUsersUrl("xlsx")}
            className="font-ui text-xs font-semibold px-4 py-2.5 rounded-lg bg-navy text-paper hover:bg-navy-light"
          >
            Export Excel
          </a>
          <a
            href={exportUsersUrl("docx")}
            className="font-ui text-xs font-semibold px-4 py-2.5 rounded-lg border border-navy text-navy hover:bg-navy/5"
          >
            Export Word
          </a>
        </div>
      </div>

      {error && <p className="text-sm text-maroon mb-4">{error}</p>}

      {!users ? (
        <p className="font-ui text-sm text-ink/50">Loading…</p>
      ) : (
        <div className="bg-paper-dark/30 border border-gold/30 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm font-ui">
            <thead>
              <tr className="bg-navy text-paper text-left">
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gold/20">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy">{u.username}</div>
                    <div className="text-xs text-ink/50">{u.full_name}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/70">
                    {u.email || u.mobile || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={savingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="border border-gold/40 rounded px-2 py-1 bg-paper text-xs"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(u.id, !u.is_active)}
                      disabled={savingId === u.id}
                      className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        u.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.is_active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-xs text-maroon hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
