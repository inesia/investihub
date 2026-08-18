import type { Role } from "@prisma/client";
import type { SessionPayload } from "@/lib/auth-session";
import { getBrand, resolveTenantSlug } from "@/lib/branding";
import fs from "fs";
import path from "path";

export interface MockUser extends SessionPayload {
  password: string;
}

const defaultUsers: MockUser[] = [
  {
    id: "user-inv-001",
    name: "Sigit Sartono",
    email: "investigator@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-002",
    name: "Rudy Aru Rachman",
    email: "rudy@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-003",
    name: "Triyani Firdaus",
    email: "triyani@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-004",
    name: "Wahyu Noviansyah",
    email: "wahyu@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-005",
    name: "Akbar Ramadhan",
    email: "akbar@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-006",
    name: "Encep Supriadi",
    email: "encep@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-007",
    name: "Prana Ramadhan",
    email: "prana@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-008",
    name: "Anwim Yanma Aji",
    email: "anwim@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-009",
    name: "Heru Adelisbowo",
    email: "heru@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-010",
    name: "Rd. Teja Bagjasumirat Natakusumah",
    email: "teja@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-011",
    name: "Rizky Adhyatma",
    email: "rizky@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-inv-012",
    name: "Rahmad Fadhil",
    email: "rahmad@investihub.com",
    password: "password123",
    role: "INVESTIGATOR",
  },
  {
    id: "user-client-manulife",
    name: "Siti Rahayu",
    email: "client@manulife.co.id",
    password: "password123",
    role: "CLIENT",
    companyName: "PT Asuransi Jiwa Manulife Indonesia",
    clientId: "client-002",
    tenantSlug: "manulife",
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
    id: "user-client-allianz",
    name: "Siti Rahayu",
    email: "client@allianz.co.id",
    password: "password123",
    role: "CLIENT",
    companyName: "PT Asuransi Allianz Life Indonesia",
    clientId: "client-004",
    tenantSlug: "allianz",
  },
  {
    id: "user-admin-001",
    name: "Admin User",
    email: "admin@investihub.com",
    password: "password123",
    role: "ADMIN",
  },
];

const JSON_FILE_PATH = path.join(process.cwd(), "src/lib/users-store.json");

function loadUsers(): MockUser[] {
  try {
    let users = defaultUsers;
    if (fs.existsSync(JSON_FILE_PATH)) {
      const data = fs.readFileSync(JSON_FILE_PATH, "utf8");
      users = JSON.parse(data);
    } else {
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(defaultUsers, null, 2));
    }
    return users.filter((u) => u.tenantSlug !== "prudential" && !u.email.toLowerCase().includes("prudential"));
  } catch {
    return defaultUsers.filter((u) => u.tenantSlug !== "prudential" && !u.email.toLowerCase().includes("prudential"));
  }
}

function saveUsers(users: MockUser[]): void {
  try {
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Failed to save users:", err);
  }
}

export function getAllUsers(): MockUser[] {
  return loadUsers();
}

export function findUserByEmail(email: string): MockUser | undefined {
  const users = loadUsers();
  return users.find(
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
  photo?: string;
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
    photo: data.photo,
  };

  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return { user };
}

export function getUserById(id: string): MockUser | undefined {
  const users = loadUsers();
  return users.find((u) => u.id === id);
}

export function updateUser(
  id: string,
  updatedData: Partial<Omit<MockUser, "id">>
): MockUser | null {
  const users = loadUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  // If company name was updated, resolve tenantSlug and clientId automatically
  let extra: Partial<MockUser> = {};
  if (updatedData.companyName !== undefined && updatedData.companyName !== "") {
    const tenantSlug = resolveTenantSlug({ companyName: updatedData.companyName });
    const clientId = getBrand(tenantSlug).clientId ?? "client-001";
    extra = {
      tenantSlug: tenantSlug === "default" ? undefined : tenantSlug,
      clientId,
    };
  }

  // Clear company details if role is changed to something else than CLIENT
  const finalRole = updatedData.role !== undefined ? updatedData.role : users[index].role;
  if (finalRole !== "CLIENT") {
    extra = {
      ...extra,
      companyName: undefined,
      clientId: undefined,
      tenantSlug: undefined,
    };
  }

  users[index] = {
    ...users[index],
    ...updatedData,
    ...extra,
  };

  saveUsers(users);
  return users[index];
}

export function deleteUser(id: string): boolean {
  const users = loadUsers();
  const nextUsers = users.filter((u) => u.id !== id);
  if (users.length === nextUsers.length) return false;
  saveUsers(nextUsers);
  return true;
}
