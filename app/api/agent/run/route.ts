import { NextResponse } from "next/server";
import { isAgentType } from "@/src/lib/agents";
import { getCurrentUser } from "@/src/lib/auth";
import { asString, jsonError, readJsonBody } from "@/src/lib/http";
import { recordAgentRequest } from "@/src/lib/projects";
import { isDatabaseConfigured } from "@/src/prisma/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isDatabaseConfigured()) {
      return jsonError("DATABASE_URL is not configured.", 503);
    }

    const user = await getCurrentUser();

    if (!user) {
      return jsonError("You must be signed in.", 401);
    }

    const body = await readJsonBody(request);

    if (!body) {
      return jsonError("Request body must be JSON.", 400);
    }

    const prompt = asString(body.prompt).trim();
    const projectId = Number(body.projectId);
    const agent = asString(body.agent || body.agentType).toUpperCase() || "PLANNER";
    const conversationIdRaw = body.conversationId;
    const conversationId =
      typeof conversationIdRaw === "number"
        ? conversationIdRaw
        : Number(conversationIdRaw);

    if (!prompt) {
      return jsonError("prompt is required.", 400);
    }

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return jsonError("A valid projectId is required.", 400);
    }

    if (!isAgentType(agent)) {
      return jsonError("Invalid agent type.", 400);
    }

    const result = await recordAgentRequest({
      userId: user.id,
      projectId,
      prompt,
      agentType: agent,
      conversationId:
        Number.isInteger(conversationId) && conversationId > 0
          ? conversationId
          : undefined,
    });

    if (!result) {
      return jsonError("Project not found.", 404);
    }

    return NextResponse.json({
      recorded: true,
      engineConnected: false,
      conversationId: result.conversationId,
      run: {
        id: result.run.id,
        agentType: result.run.agentType,
        status: result.run.status,
        prompt: result.run.prompt,
        result: result.run.result,
        createdAt: result.run.createdAt,
      },
      acknowledgement: result.acknowledgement,
    });
  } catch (error) {
    console.error("Agent run error:", error);
    return jsonError("Unable to record the VEXA request.", 500);
  }
}
