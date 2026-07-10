import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { AUTH_COOKIE, encodeSession } from "@/lib/auth-session";
import { registerUser } from "@/lib/mock-users";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, role, companyName } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const result = registerUser({
    name,
    email,
    password,
    role: role as Role,
    companyName,
  });

  if (result.error || !result.user) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const user = result.user;
  const session = encodeSession({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    clientId: user.clientId,
    tenantSlug: user.tenantSlug,
  });

  const response = NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyName: user.companyName,
      clientId: user.clientId,
      tenantSlug: user.tenantSlug,
    },
  });

  response.cookies.set(AUTH_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
