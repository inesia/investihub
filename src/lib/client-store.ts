export interface MockClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  activeCases: number;
  logo?: string;
}

const STORAGE_KEY = "investihub-clients-data-v4"; // increment version to trigger fresh defaultClients with logos

const defaultClients: MockClient[] = [
  {
    id: "client-002",
    name: "PT Asuransi Allianz Life Indonesia",
    email: "info@allianz.co.id",
    phone: "+62 21 8765 4321",
    activeCases: 0,
    logo: "/brands/allianz/logo.svg",
  },
  {
    id: "client-003",
    name: "PT Prudential Life Assurance",
    email: "info@prudential.co.id",
    phone: "+62 21 2995 8888",
    activeCases: 0,
    logo: "/brands/prudential/Prudential_plc_logo.svg.webp",
  },
];

export function getClients(): MockClient[] {
  if (typeof window === "undefined") return defaultClients.filter((c) => c.id !== "client-003");
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultClients));
      return defaultClients.filter((c) => c.id !== "client-003");
    }
    const parsed = JSON.parse(raw) as MockClient[];
    return parsed.filter((c) => c.id !== "client-003");
  } catch {
    return defaultClients.filter((c) => c.id !== "client-003");
  }
}

export function saveClients(clients: MockClient[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function addClient(client: Omit<MockClient, "id" | "activeCases">): MockClient {
  const clients = getClients();
  const newClient: MockClient = {
    ...client,
    id: `client-${Date.now()}`,
    activeCases: 0,
  };
  clients.push(newClient);
  saveClients(clients);
  return newClient;
}

export function updateClient(id: string, updated: Partial<Omit<MockClient, "id" | "activeCases">>): MockClient | null {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) return null;
  
  clients[index] = {
    ...clients[index],
    ...updated,
  };
  saveClients(clients);
  return clients[index];
}

export function deleteClient(id: string): boolean {
  const clients = getClients();
  const nextClients = clients.filter((c) => c.id !== id);
  if (clients.length === nextClients.length) return false;
  saveClients(nextClients);
  return true;
}
