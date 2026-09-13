import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { hashPassword } from "@/src/lib/password";
import { createSession } from "@/src/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const username = String(body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with that email or username already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    await createSession(user.id);

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: "Something went wrong while creating your account." },
      { status: 500 }
    );
  }
}