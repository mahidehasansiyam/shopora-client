"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Loader2, Trash2, AlertTriangle, Shield, ShieldOff, User as UserIcon } from "lucide-react";
import type { User } from "@/types/user";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

export default function AdminUsers() {
  const { data: session } = useSession();
  const token = session?.session?.token;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (cancelled) return;
        if (json.success) {
          setUsers(json.data);
        } else {
          toast.error(json.message || "Failed to load users");
        }
      } catch {
        if (!cancelled) toast.error("Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [token]);

  async function handleDelete(userId: string) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setDeletingId(userId);
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        toast.error(json.message || "Failed to delete user");
      }
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  }

  const roleBadge = (role: string) => {
    const isAdmin = role === "admin";
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isAdmin
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {isAdmin ? <Shield size={12} /> : <ShieldOff size={12} />}
        {role}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const currentUserId = session?.user?.id;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage registered users.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle size={48} className="text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">No users found</h2>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Joined</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    <span className="truncate">{user.email}</span>
                  </td>
                  <td className="px-4 py-3">{roleBadge(user.role)}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user._id === currentUserId ? (
                      <span className="text-xs text-muted-foreground italic">Current</span>
                    ) : (
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={deletingId === user._id}
                        className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete user"
                      >
                        {deletingId === user._id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UserAvatar({ user }: { user: User }) {
  const [failed, setFailed] = useState(false);

  if (user.image && !failed) {
    return (
      <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-muted">
        <img
          src={user.image}
          alt={user.name}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
      {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
    </div>
  );
}
