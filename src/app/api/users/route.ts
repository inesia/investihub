import { NextResponse } from "next/server";
import { getAllUsers, registerUser, updateUser, deleteUser } from "@/lib/mock-users";
import { Role } from "@prisma/client";

export async function GET() {
  const users = getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, companyName, role, photo } = body;

    if (!name || !email || !password || (role !== "INVESTIGATOR" && role !== "ADMIN" && !companyName)) {
      return NextResponse.json(
        { error: "Name, email, password, and companyName (for clients) are required" },
        { status: 400 }
      );
    }

    const { user, error } = registerUser({
      name,
      email,
      password,
      role: (role || "CLIENT") as Role,
      companyName: (role === "INVESTIGATOR" || role === "ADMIN") ? undefined : companyName,
      photo,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ user });
  } catch (_err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, password, companyName, role, photo } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updatedUser = updateUser(id, {
      name,
      email,
      password,
      companyName,
      role: role as Role,
      photo,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (_err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const success = deleteUser(id);
    if (!success) {
      return NextResponse.json({ error: "User not found or deletion failed" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (_err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
