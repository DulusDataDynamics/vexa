import { db } from "@/src/prisma/db";
import {
  acknowledgeUnconnectedEngine,
  engineAssistantMessage,
  type AgentType,
} from "@/src/lib/agents";

export type ProjectSummary = {
  id: number;
  name: string;
  description: string | null;
  status: "ACTIVE" | "ARCHIVED";
  repositoryUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorkspacePayload = {
  project: ProjectSummary;
  files: Array<{
    id: number;
    path: string;
    language: string | null;
    content: string | null;
    size: number;
    updatedAt: string;
  }>;
  conversations: Array<{
    id: number;
    title: string | null;
    createdAt: string;
    messages: Array<{
      id: number;
      role: "USER" | "ASSISTANT" | "SYSTEM";
      content: string;
      createdAt: string;
    }>;
  }>;
  agentRuns: Array<{
    id: number;
    agentType: AgentType;
    status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
    prompt: string;
    result: string | null;
    createdAt: string;
    startedAt: string | null;
    completedAt: string | null;
  }>;
  changes: Array<{
    id: number;
    filePath: string;
    changeType: "CREATE" | "UPDATE" | "DELETE" | "RENAME";
    summary: string;
    diff: string | null;
    createdAt: string;
  }>;
  activities: Array<{
    id: number;
    action: string;
    metadata: string | null;
    createdAt: string;
  }>;
  deployments: Array<{
    id: number;
    provider: string;
    environment: "DEVELOPMENT" | "PREVIEW" | "PRODUCTION";
    url: string | null;
    status: "QUEUED" | "BUILDING" | "SUCCESS" | "FAILED" | "CANCELLED";
    createdAt: string;
  }>;
};

function toProjectSummary(project: {
  id: number;
  name: string;
  description: string | null;
  status: "ACTIVE" | "ARCHIVED";
  repositoryUrl: string | null;
  createdAt: string;
  updatedAt: string;
}): ProjectSummary {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    repositoryUrl: project.repositoryUrl,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function listProjectsForUser(
  userId: number,
): Promise<ProjectSummary[]> {
  const projects = await db.orm.public.Project.where({ userId })
    .orderBy((project) => project.updatedAt.desc())
    .all();

  return projects.map(toProjectSummary);
}

export async function getOwnedProject(userId: number, projectId: number) {
  return db.orm.public.Project.where({ id: projectId, userId }).first();
}

export async function createProjectForUser(input: {
  userId: number;
  name: string;
  description: string | null;
}) {
  const project = await db.orm.public.Project.create({
    userId: input.userId,
    name: input.name,
    description: input.description,
    status: "ACTIVE",
  });

  if (input.description) {
    await db.orm.public.ProjectFile.create({
      projectId: project.id,
      path: "README.md",
      language: "markdown",
      content: `# ${input.name}\n\n${input.description}\n`,
      size: Buffer.byteLength(`# ${input.name}\n\n${input.description}\n`),
    });
  }

  await db.orm.public.Activity.create({
    userId: input.userId,
    projectId: project.id,
    action: "PROJECT_CREATED",
    metadata: input.name,
  });

  return toProjectSummary(project);
}

export async function loadWorkspace(
  userId: number,
  projectId: number,
): Promise<WorkspacePayload | null> {
  const project = await getOwnedProject(userId, projectId);

  if (!project) {
    return null;
  }

  const [files, conversations, agentRuns, changes, activities, deployments] =
    await Promise.all([
      db.orm.public.ProjectFile.where({ projectId })
        .orderBy((file) => file.path.asc())
        .all(),
      db.orm.public.Conversation.where({ projectId })
        .include("messages", (messages) =>
          messages.orderBy((message) => message.createdAt.asc()),
        )
        .orderBy((conversation) => conversation.createdAt.desc())
        .all(),
      db.orm.public.AgentRun.where({ projectId })
        .orderBy((run) => run.createdAt.desc())
        .all(),
      db.orm.public.CodeChange.where({ projectId })
        .orderBy((change) => change.createdAt.desc())
        .all(),
      db.orm.public.Activity.where({ projectId })
        .orderBy((activity) => activity.createdAt.desc())
        .limit(40)
        .all(),
      db.orm.public.Deployment.where({ projectId })
        .orderBy((deployment) => deployment.createdAt.desc())
        .all(),
    ]);

  return {
    project: toProjectSummary(project),
    files: files.map((file) => ({
      id: file.id,
      path: file.path,
      language: file.language,
      content: file.content,
      size: file.size,
      updatedAt: file.updatedAt,
    })),
    conversations: conversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      messages: conversation.messages.map((message: any) => ({
        id: message.id as number,
        role: message.role as "USER" | "ASSISTANT" | "SYSTEM",
        content: message.content as string,
        createdAt: message.createdAt as string,
      })),
    })),
    agentRuns: agentRuns.map((run) => ({
      id: run.id,
      agentType: run.agentType,
      status: run.status,
      prompt: run.prompt,
      result: run.result,
      createdAt: run.createdAt,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
    })),
    changes: changes.map((change) => ({
      id: change.id,
      filePath: change.filePath,
      changeType: change.changeType,
      summary: change.summary,
      diff: change.diff,
      createdAt: change.createdAt,
    })),
    activities: activities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      metadata: activity.metadata,
      createdAt: activity.createdAt,
    })),
    deployments: deployments.map((deployment) => ({
      id: deployment.id,
      provider: deployment.provider,
      environment: deployment.environment,
      url: deployment.url,
      status: deployment.status,
      createdAt: deployment.createdAt,
    })),
  };
}

export async function recordAgentRequest(input: {
  userId: number;
  projectId: number;
  prompt: string;
  agentType: AgentType;
  conversationId?: number;
}) {
  const project = await getOwnedProject(input.userId, input.projectId);

  if (!project) {
    return null;
  }

  let conversationId = input.conversationId ?? null;

  if (conversationId) {
    const conversation = await db.orm.public.Conversation.where({
      id: conversationId,
      projectId: input.projectId,
      userId: input.userId,
    }).first();

    if (!conversation) {
      conversationId = null;
    }
  }

  if (!conversationId) {
    const conversation = await db.orm.public.Conversation.create({
      projectId: input.projectId,
      userId: input.userId,
      title: input.prompt.slice(0, 80),
    });
    conversationId = conversation.id;
  }

  await db.orm.public.Message.create({
    conversationId,
    role: "USER",
    content: input.prompt,
  });

  const startedAt = new Date().toISOString();
  const acknowledgement = acknowledgeUnconnectedEngine(
    input.agentType,
    input.prompt,
  );
  const assistantContent = engineAssistantMessage(acknowledgement);
  const completedAt = new Date().toISOString();

  const agentRun = await db.orm.public.AgentRun.create({
    projectId: input.projectId,
    conversationId,
    agentType: input.agentType,
    status: "COMPLETED",
    prompt: input.prompt,
    result: assistantContent,
    startedAt,
    completedAt,
  });

  await db.orm.public.Message.create({
    conversationId,
    role: "ASSISTANT",
    content: assistantContent,
  });

  await db.orm.public.Activity.create({
    userId: input.userId,
    projectId: input.projectId,
    action: "AGENT_RUN_RECORDED",
    metadata: `${input.agentType}:${agentRun.id}`,
  });

  return {
    conversationId,
    run: agentRun,
    acknowledgement,
  };
}
