import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import { Admin } from "./models";
import { idOf } from "./serialize";

const COOKIE_NAME = "cc_admin_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET || "coupon-chrome-dev-secret";
  return new TextEncoder().encode(secret);
}

export async function createSession(adminId: string, username: string) {
  const token = await new SignJWT({ adminId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{
  adminId: string;
  username: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.adminId !== "string" || typeof payload.username !== "string") {
      return null;
    }
    return { adminId: payload.adminId, username: payload.username };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function verifyAdminCredentials(username: string, password: string) {
  await connectDB();
  const admin = await Admin.findOne({ username }).lean();
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) return null;
  return { ...admin, id: idOf(admin._id) };
}

export { COOKIE_NAME };
