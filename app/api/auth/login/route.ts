import { NextResponse } from "next/server";
import { isValidEmail, toPublicUser } from "@/src/lib/auth";
import { asString, jsonError, readJsonBody } from "@/src/lib/http";
import { verifyPassword } from "@/src/lib/password";
import { createSession, isAuthConfigured } from "@/src/lib/session";
import { db, isDatabaseConfigured } from "@/src/prisma/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonError("DATABASE_URL is not configured.", 503);
    }

    if (!isAuthConfigured()) {
      return jsonError("AUTH_SECRET is not configured.", 503);
    }

    const body = await readJsonBody(request);

    if (!body) {
      return jsonError("Request body must be JSON.", 400);
    }

    const email = asString(body.email).trim().toLowerCase();
    const password = asString(body.password);

    if (!email || !password) {
      return jsonError("Email and password are required.", 400);
    }

    if (!isValidEmail(email)) {
      return jsonError("Enter a valid email address.", 400);
    }

    const user = await db.orm.public.User.where({ email }).first();

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return jsonError("Invalid email or password.", 401);
    }

    await createSession(user.id);

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    console.error("Login error:", error);
    return jsonError("Unable to sign in.", 500);
  }
}
