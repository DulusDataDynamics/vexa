import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/src/prisma/db";
import { isAuthConfigured } from "@/src/lib/session";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "vexa",
    database: isDatabaseConfigured(),
    auth: isAuthConfigured(),
  });
}
