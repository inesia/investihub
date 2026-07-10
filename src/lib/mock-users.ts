import type { Role } from "@prisma/client";
import type { SessionPayload } from "@/lib/auth-session";
import { getBrand, resolveTenantSlug } from "@/lib/branding";

export interface MockUser extends SessionPayload {
  password: string;
}

const defaultUsers: MockUser[] = [
  {
    id: "user-inv-001",
    name: "Ahmad Rizki",
    email: "investigator@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-client-001",
    name: "Rina Kusuma",
    email: "client@investihub.com",
    password: "password123",
    role: "CLIENT",
    companyName: "PT Asuransi Sejahtera",
    clientId: "client-001",
  },
  {
    id: "user-client-allianz",
    name: "Siti Rahayu",
    email: "client@allianz.co.id",
    password: "password123",
    role: "CLIENT",
    companyName: "PT Allianz Indonesia",
    clientId: "client-002",
    tenantSlug: "allianz",
  },
  {
    id: "user-client-prudential",
    name: "Andi Wijaya",
    email: "client@prudential.co.id",
    password: "password123",
    role: "CLIENT",
    companyName: "PT Prudential Life Assurance",
    clientId: "client-003",
    tenantSlug: "prudential",
  },
  {
    id: "user-admin-001",
    name: "Admin User",
    email: "admin@investihub.com",
    password: "password123",
    role: "ADMIN",
  },
];

let registeredUsers: MockUser[] = [...defaultUsers];

export function findUserByEmail(email: string): MockUser | undefined {
  return registeredUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function validateCredentials(
  email: string,
  password: string
): MockUser | null {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) return null;
  return user;
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  companyName?: string;
}): { user?: MockUser; error?: string } {
  if (findUserByEmail(data.email)) {
    return { error: "Email already registered" };
  }

  const tenantSlug = resolveTenantSlug({ companyName: data.companyName });
  const clientId =
    data.role === "CLIENT"
      ? getBrand(tenantSlug).clientId ?? "client-001"
      : undefined;

  const user: MockUser = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    companyName: data.companyName,
    clientId,
    tenantSlug: tenantSlug === "default" ? undefined : tenantSlug,
  };

  registeredUsers = [...registeredUsers, user];
  return { user };
}

export function getUserById(id: string): MockUser | undefined {
  return registeredUsers.find((u) => u.id === id);
}
