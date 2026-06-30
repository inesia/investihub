import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, decodeSession } from "@/lib/auth-session";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const session = decodeSession(token);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: session.id,
      name: session.name,
      email: session.email,
      role: session.role,
      companyName: session.companyName,
    },
  });
}
