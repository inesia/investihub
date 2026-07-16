"use client";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClients, addClient, updateClient, deleteClient, type MockClient } from "@/lib/client-store";
import { useAuth } from "@/contexts/auth-context";
import { Building2, Mail, Phone, Plus, User, Shield, Edit2, Trash2, X, AlertCircle, Key } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function ClientsPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const [activeTab, setActiveTab] = useState<"clients" | "users">("clients");
  const [clients, setClients] = useState<MockClient[]>([]);

  // Clients Tab States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<MockClient | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");

  // User Tab States
  const [users, setUsers] = useState<any[]>([]);
  const [roleFilter, setRoleFilter] = useState<"ALL" | "INVESTIGATOR" | "CLIENT">("ALL");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [userFormData, setUserFormData] = useState({ name: "", email: "", password: "", companyName: "" });
  const [userError, setUserError] = useState("");

  // Confirmation Modals States
  const [deleteClientConfirmOpen, setDeleteClientConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
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

  // Client Handlers
  const openAddModal = () => {
    setEditingClient(null);
    setFormData({ name: "", email: "", phone: "" });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (client: MockClient) => {
    setEditingClient(client);
    setFormData({ name: client.name, email: client.email, phone: client.phone });
    setError("");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Nama perusahaan asuransi wajib diisi");
    if (!formData.email.trim()) return setError("Email wajib diisi");
    if (!formData.phone.trim()) return setError("Nomor telepon wajib diisi");

    if (editingClient) {
      updateClient(editingClient.id, formData);
    } else {
      addClient(formData);
    }

    setIsModalOpen(false);
    refreshClients();
  };

  const triggerDeleteClient = (id: string) => {
    setClientToDelete(id);
    setDeleteClientConfirmOpen(true);
  };

  const executeDeleteClient = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      setClientToDelete(null);
      refreshClients();
    }
  };

  // User Handlers
  const openAddUserModal = () => {
    setEditingUser(null);
    // Auto-select first client company as default if available
    const defaultCompany = clients[0]?.name || "";
    setUserFormData({ name: "", email: "", password: "password123", companyName: defaultCompany });
    setUserError("");
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (user: any) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      password: user.password || "password123",
      companyName: user.companyName || "",
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
    if (!userFormData.companyName.trim()) return setUserError("Perusahaan Asuransi wajib dipilih");

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
    } catch (err) {
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
    } catch (err) {
      alert("Gagal menghapus pengguna");
    } finally {
      setUserToDelete(null);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    if (roleFilter === "ALL") return true;
    return u.role === roleFilter;
  });

  return (
    <AppShell title="Manajemen Klien & Pengguna">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Kelola klien perusahaan asuransi dan daftar pengguna sistem
        </p>
        
        {isAdmin && (
          <div className="flex gap-2">
            {activeTab === "clients" ? (
              <Button size="sm" onClick={openAddModal}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Perusahaan
              </Button>
            ) : (
              <Button size="sm" onClick={openAddUserModal}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pengguna Klien
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mb-6 flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("clients")}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeTab === "clients"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Perusahaan Asuransi
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-2 px-1 ml-4 text-sm font-medium transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Daftar Pengguna
        </button>
      </div>

      {activeTab === "clients" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id} className="border-neutral-200 shadow-sm hover:shadow transition-shadow relative group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(client)}
                        className="p-1.5 rounded-md hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit Perusahaan"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => triggerDeleteClient(client.id)}
                        className="p-1.5 rounded-md hover:bg-red-50 text-muted-foreground hover:text-destructive transition-colors"
                        title="Hapus Perusahaan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{client.phone}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-4">
          {/* User Filters */}
          <div className="flex gap-2 pb-2">
            {(["ALL", "INVESTIGATOR", "CLIENT"] as const).map((role) => (
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
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        u.role === "INVESTIGATOR" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {u.role === "INVESTIGATOR" ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.role}</p>
                      </div>
                    </div>

                    {isAdmin && u.role === "CLIENT" && (
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
                    {u.companyName && (
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
        </div>
      )}

      {/* CLIENT CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-lg text-foreground">
                {editingClient ? "Edit Perusahaan Asuransi" : "Tambah Perusahaan Asuransi"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md hover:bg-neutral-100 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-primary">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700">Nama Perusahaan *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. PT Allianz Indonesia"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. info@allianz.co.id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700">Telepon *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +62 21 8765 4321"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
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

      {/* USER CRUD MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-lg text-foreground">
                {editingUser ? "Edit Pengguna Klien" : "Tambah Pengguna Klien"}
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
                  placeholder="e.g. client@allianz.co.id"
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

      {/* Confirm Modal for Client Company deletion */}
      <ConfirmModal
        isOpen={deleteClientConfirmOpen}
        onClose={() => setDeleteClientConfirmOpen(false)}
        onConfirm={executeDeleteClient}
        title="Hapus Perusahaan Asuransi"
        message="Apakah Anda yakin ingin menghapus perusahaan asuransi ini? Semua data terkait asuransi ini di sistem akan terpengaruh. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        isDestructive={true}
      />

      {/* Confirm Modal for Client User deletion */}
      <ConfirmModal
        isOpen={deleteUserConfirmOpen}
        onClose={() => setDeleteUserConfirmOpen(false)}
        onConfirm={executeDeleteUser}
        title="Hapus Pengguna Klien"
        message="Apakah Anda yakin ingin menghapus akun pengguna Klien ini? Pengguna tidak akan bisa login lagi ke portal. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus"
        cancelText="Batal"
        isDestructive={true}
      />
    </AppShell>
  );
}
