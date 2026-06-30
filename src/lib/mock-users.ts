import type { Role } from "@prisma/client";
import type { SessionPayload } from "@/lib/auth-session";

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
    name: "Budi Santoso",
    email: "client@investihub.com",
    password: "password123",
    role: "CLIENT",
    companyName: "PT Asuransi Sejahtera",
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

  const user: MockUser = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    companyName: data.companyName,
  };

  registeredUsers = [...registeredUsers, user];
  return { user };
}

export function getUserById(id: string): MockUser | undefined {
  return registeredUsers.find((u) => u.id === id);
}
