import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import crypto from "node:crypto";

const SESSION_COOKIE = "vexa_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured");
  }

  return new TextEncoder().encode(secret);
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(
  password: string,
  storedPassword: string
) {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(hash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}

export async function createSession(userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (typeof payload.userId !== "number") {
      return null;
    }

    return payload.userId;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}