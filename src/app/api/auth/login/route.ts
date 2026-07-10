import { NextResponse } from "next/server";
import { AUTH_COOKIE, encodeSession } from "@/lib/auth-session";
import { validateCredentials } from "@/lib/mock-users";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = validateCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

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
