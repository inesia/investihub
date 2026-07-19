"use client";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClients, type MockClient } from "@/lib/client-store";
import { useAuth } from "@/contexts/auth-context";
import { User, UserPlus, Pencil, Trash2, Mail, Building2, Shield, X, AlertCircle, Key, Plus, Edit2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { type User as PrismaUser } from "@prisma/client";

type User = PrismaUser & { photo?: string };

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<MockClient[]>([]);
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "INVESTIGATOR" | "CLIENT">("ALL");

  // User Modal States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT",
    companyName: "",
    photo: "",
  });
  const [userError, setUserError] = useState("");

  // Confirmation Modal
  const [deleteUserConfirmOpen, setDeleteUserConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const refreshClients = () => {
    setClients(getClients());
  };

  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    refreshClients();
    refreshUsers();
  }, []);

  const openAddUserModal = () => {
    setEditingUser(null);
    const defaultCompany = clients[0]?.name || "";
    setUserFormData({
      name: "",
      email: "",
      password: "password123",
      role: "CLIENT",
      companyName: defaultCompany,
      photo: "",
    });
    setUserError("");
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: User) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      password: user.password || "password123",
      role: user.role,
      companyName: user.companyName || "",
      photo: user.photo || "",
    });
    setUserError("");
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError("");

    if (!userFormData.name.trim()) return setUserError("Nama pengguna wajib diisi");
    if (!userFormData.email.trim()) return setUserError("Email wajib diisi");
    if (!userFormData.password.trim()) return setUserError("Password wajib diisi");
    if (userFormData.role === "CLIENT" && !userFormData.companyName.trim()) {
      return setUserError("Perusahaan Asuransi wajib dipilih untuk Pengguna Klien");
    }

    try {
      const method = editingUser ? "PUT" : "POST";
      const payload = editingUser ? { id: editingUser.id, ...userFormData } : userFormData;

      const res = await fetch("/api/users", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        return setUserError(data.error || "Gagal menyimpan pengguna");
      }

      setIsUserModalOpen(false);
      refreshUsers();
    } catch {
      setUserError("Terjadi kesalahan koneksi server");
    }
  };

  const triggerDeleteUser = (id: string) => {
    setUserToDelete(id);
    setDeleteUserConfirmOpen(true);
  };

  const executeDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`/api/users?id=${userToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        refreshUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus pengguna");
      }
    } catch {
      alert("Gagal menghapus pengguna");
    } finally {
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter === "ALL") return true;
    return u.role === roleFilter;
  });

  return (
    <AppShell title="Manajemen Pengguna">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Kelola daftar pengguna sistem (Investigator dan Klien)
        </p>

        {isAdmin && (
          <Button size="sm" onClick={openAddUserModal}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pengguna
          </Button>
        )}
      </div>

      <div className="flex gap-2 pb-4 mb-4 border-b border-border">
        {(["ALL", "ADMIN", "INVESTIGATOR", "CLIENT"] as const).map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all border ${
              roleFilter === role
                ? "bg-primary border-primary text-white"
                : "border-neutral-200 text-muted-foreground hover:bg-neutral-50"
            }`}
          >
            {role === "ALL" ? "Semua Peran" : role}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredUsers.map((u) => (
          <Card key={u.id} className="border-neutral-200 relative group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {u.photo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={u.photo} 
                        alt={u.name} 
                        className="h-10 w-10 shrink-0 rounded-full object-cover bg-white border border-neutral-200" 
                      />
                    </>
                  ) : u.role === "CLIENT" && clients.find((c) => c.name === u.companyName)?.logo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={clients.find((c) => c.name === u.companyName)?.logo} 
                        alt={u.companyName || u.name} 
                        className="h-10 w-10 shrink-0 rounded-full object-contain bg-white border border-neutral-200 p-1" 
                      />
                    </>
                  ) : (
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      u.role === "INVESTIGATOR" ? "bg-amber-100 text-amber-700" : u.role === "ADMIN" ? "bg-rose-100 text-rose-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {u.role === "INVESTIGATOR" ? <Shield className="h-5 w-5" /> : u.role === "ADMIN" ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="font-semibold text-sm">{u.name}</p>
                      {u.role === "CLIENT" && u.companyName && (
                        <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-800 border border-neutral-200">
                          {u.companyName === "PT Allianz Indonesia" ? "Allianz" : u.companyName === "PT Prudential Life Assurance" ? "Prudential" : u.companyName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{u.role}</p>
                  </div>
                </div>

                {isAdmin && u.id !== currentUser?.id && (
                  <div className="flex gap-0.5">
                    <button
                      onClick={() => openEditUserModal(u)}
                      className="p-1 rounded hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Pengguna"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => triggerDeleteUser(u.id)}
                      className="p-1 rounded hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors"
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground border-t border-neutral-100 pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{u.email}</span>
                </div>
                {u.role === "CLIENT" && u.companyName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{u.companyName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* USER CRUD MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-lg text-foreground">
                {editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-md hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="mt-4 space-y-4">
              {userError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-primary">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{userError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700">Nama Pengguna *</label>
                <input
                  type="text"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  placeholder="e.g. Siti Rahayu"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700">Email Login *</label>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  placeholder="e.g. user@investihub.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700 flex items-center gap-1">
                  <Key className="h-3.5 w-3.5 text-neutral-400" />
                  Password *
                </label>
                <input
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                  placeholder="Masukkan password login"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700">Peran (Role) *</label>
                <select
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="CLIENT">CLIENT</option>
                  <option value="INVESTIGATOR">INVESTIGATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700">Foto Profil (Opsional)</label>
                <div className="flex items-center gap-3">
                  {userFormData.photo && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={userFormData.photo} alt="Preview" className="h-10 w-10 rounded-full object-cover bg-white border border-neutral-200" />
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setUserFormData((prev) => ({ ...prev, photo: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {userFormData.role === "CLIENT" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-neutral-700">Perusahaan Asuransi Asosiasi *</label>
                  <select
                    value={userFormData.companyName}
                    onChange={(e) => setUserFormData({ ...userFormData, companyName: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="">-- Pilih Perusahaan --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUserModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" size="sm">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal for Client User deletion */}
      <ConfirmModal
        isOpen={deleteUserConfirmOpen}
        onClose={() => setDeleteUserConfirmOpen(false)}
        onConfirm={executeDeleteUser}
        title="Hapus Pengguna"
        message="Apakah Anda yakin ingin menghapus akun pengguna ini? Pengguna tidak akan bisa login lagi ke portal. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        isDestructive={true}
      />
    </AppShell>
  );
}
