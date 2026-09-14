import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { asString, jsonError, readJsonBody } from "@/src/lib/http";
import { createProjectForUser, listProjectsForUser } from "@/src/lib/projects";
import { isDatabaseConfigured } from "@/src/prisma/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return jsonError("DATABASE_URL is not configured.", 503);
    }

    const user = await getCurrentUser();

    if (!user) {
      return jsonError("You must be signed in.", 401);
    }

    const projects = await listProjectsForUser(user.id);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("List projects error:", error);
    return jsonError("Unable to load projects.", 500);
  }
}

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonError("DATABASE_URL is not configured.", 503);
    }

    const user = await getCurrentUser();

    if (!user) {
      return jsonError("You must be signed in to create a project.", 401);
    }

    const body = await readJsonBody(request);

    if (!body) {
      return jsonError("Request body must be JSON.", 400);
    }

    const name = asString(body.name).trim();
    const description = asString(body.description).trim();

    if (!name) {
      return jsonError("Project name is required.", 400);
    }

    if (name.length > 80) {
      return jsonError("Project name must be 80 characters or fewer.", 400);
    }

    const project = await createProjectForUser({
      userId: user.id,
      name,
      description: description || null,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Create project error:", error);
    return jsonError("Unable to create the project.", 500);
  }
}
