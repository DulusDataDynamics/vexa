export const AGENT_TYPES = [
  "PLANNER",
  "CODER",
  "DEBUGGER",
  "REVIEWER",
  "DEPLOYER",
] as const;

export type AgentType = (typeof AGENT_TYPES)[number];

export function isAgentType(value: string): value is AgentType {
  return (AGENT_TYPES as readonly string[]).includes(value);
}

export type EngineAcknowledgement = {
  implemented: false;
  agentType: AgentType;
  summary: string;
  nextStep: string;
};

export function acknowledgeUnconnectedEngine(
  agentType: AgentType,
  prompt: string,
): EngineAcknowledgement {
  return {
    implemented: false,
    agentType,
    summary: `Recorded for the ${agentType} agent: ${prompt.slice(0, 240)}`,
    nextStep:
      "The VEXA engineering engine is not connected in this release. This run is stored so a later PLANNER → CODER → test → DEBUGGER → REVIEWER → DEPLOYER pipeline can pick it up without changing the app contract.",
  };
}

export function engineAssistantMessage(ack: EngineAcknowledgement): string {
  return [
    ack.summary,
    "",
    ack.nextStep,
    "",
    "No files were modified. No autonomous coding, testing, or deployment ran.",
  ].join("\n");
}
