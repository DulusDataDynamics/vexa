import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/lib/auth";
import { asString, jsonError, readJsonBody } from "@/src/lib/http";
import { getOwnedProject, loadWorkspace } from "@/src/lib/projects";
import { db, isDatabaseConfigured } from "@/src/prisma/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function parseProjectId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonError("DATABASE_URL is not configured.", 503);
    }

    const user = await getCurrentUser();

    if (!user) {
      return jsonError("You must be signed in.", 401);
    }

    const { id } = await context.params;
    const projectId = parseProjectId(id);

    if (!projectId) {
      return jsonError("Invalid project id.", 400);
    }

    const workspace = await loadWorkspace(user.id, projectId);

    if (!workspace) {
      return jsonError("Project not found.", 404);
    }

    return NextResponse.json(workspace);
  } catch (error) {
    console.error("Load project error:", error);
    return jsonError("Unable to load the project.", 500);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonError("DATABASE_URL is not configured.", 503);
    }

    const user = await getCurrentUser();

    if (!user) {
      return jsonError("You must be signed in.", 401);
    }

    const { id } = await context.params;
    const projectId = parseProjectId(id);

    if (!projectId) {
      return jsonError("Invalid project id.", 400);
    }

    const project = await getOwnedProject(user.id, projectId);

    if (!project) {
      return jsonError("Project not found.", 404);
    }

    const body = await readJsonBody(request);

    if (!body) {
      return jsonError("Request body must be JSON.", 400);
    }

    const status = asString(body.status).toUpperCase();
    const name = asString(body.name).trim();
    const description = asString(body.description).trim();

    const patch: {
      status?: "ACTIVE" | "ARCHIVED";
      name?: string;
      description?: string | null;
    } = {};

    if (status === "ACTIVE" || status === "ARCHIVED") {
      patch.status = status;
    }

    if (name) {
      patch.name = name;
    }

    if ("description" in body) {
      patch.description = description || null;
    }

    if (Object.keys(patch).length === 0) {
      return jsonError("No valid fields to update.", 400);
    }

    await db.orm.public.Project.where({ id: projectId }).update(patch);

    const workspace = await loadWorkspace(user.id, projectId);
    return NextResponse.json(workspace);
  } catch (error) {
    console.error("Update project error:", error);
    return jsonError("Unable to update the project.", 500);
  }
}
