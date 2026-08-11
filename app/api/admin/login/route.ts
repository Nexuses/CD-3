import { NextResponse } from "next/server";
import { createSession, verifyAdminCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    const admin = await verifyAdminCredentials(username, password);
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await createSession(admin.id, admin.username);
    return NextResponse.json({ ok: true, username: admin.username });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
