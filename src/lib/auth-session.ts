import type { Role } from "@prisma/client";
import type { AuthUser } from "@/types";

export const AUTH_COOKIE = "investihub-auth";

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyName?: string;
}

export function encodeSession(user: SessionPayload): string {
  return Buffer.from(JSON.stringify(user)).toString("base64");
}

export function decodeSession(token: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    ) as SessionPayload;
    if (!parsed.id || !parsed.email || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function toAuthUser(session: SessionPayload): AuthUser {
  return {
    id: session.id,
    name: session.name,
    email: session.email,
    role: session.role,
    companyName: session.companyName,
  };
}
