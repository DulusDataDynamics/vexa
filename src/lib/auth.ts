import { db } from "@/src/prisma/db";
import { getSessionUserId } from "@/src/lib/session";

export type PublicUser = {
  id: number;
  email: string;
  name: string | null;
  username: string | null;
  role: "USER" | "ADMIN";
};

export function toPublicUser(user: {
  id: number;
  email: string;
  name: string | null;
  username: string | null;
  role: "USER" | "ADMIN";
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    role: user.role,
  };
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const userId = await getSessionUserId();

  if (!userId) {
    return null;
  }

  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const user = await db.orm.public.User.where({ id: userId }).first();

    if (!user) {
      return null;
    }

    return toPublicUser(user);
  } catch (error) {
    console.error("Failed to load current user:", error);
    return null;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
