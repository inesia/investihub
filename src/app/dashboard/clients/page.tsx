"use client";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getClients, addClient, updateClient, deleteClient, type MockClient } from "@/lib/client-store";
import { useAuth } from "@/contexts/auth-context";
import { Building2, Mail, Phone, Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export default function ClientsPage() {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";
  const [clients, setClients] = useState<MockClient[]>([]);

  // Clients Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<MockClient | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", logo: "" });
  const [error, setError] = useState("");

  // Confirmation Modal States
  const [deleteClientConfirmOpen, setDeleteClientConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const refreshClients = () => {
    setClients(getClients());
  };

  useEffect(() => {
    refreshClients();
  }, []);

  // Client Handlers
  const openAddModal = () => {
    setEditingClient(null);
    setFormData({ name: "", email: "", phone: "", logo: "" });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (client: MockClient) => {
    setEditingClient(client);
    setFormData({ name: client.name, email: client.email, phone: client.phone, logo: client.logo || "" });
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

  return (
    <AppShell title="Manajemen Klien">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Kelola daftar klien perusahaan asuransi yang terdaftar di sistem
        </p>
        
        {isAdmin && (
          <Button size="sm" onClick={openAddModal}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Perusahaan
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="border-neutral-200 shadow-sm hover:shadow transition-shadow relative group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {client.logo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={client.logo} alt={client.name} className="h-10 w-10 rounded-lg object-contain bg-white border border-neutral-200 p-1" />
                    </>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}
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

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-neutral-700">Logo Perusahaan</label>
                <div className="flex items-center gap-3">
                  {formData.logo && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={formData.logo} alt="Preview" className="h-10 w-10 rounded-lg object-contain bg-white border border-neutral-200 p-1" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData((prev) => ({ ...prev, logo: reader.result as string }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
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
    </AppShell>
  );
}
