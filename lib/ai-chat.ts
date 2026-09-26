export type ChatRole = "citizen" | "officer";

export interface AssistantReply {
  answer: string;
  cited_rules: string[];
  context_ingested?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "");

export async function askRuleAssistant(
  role: ChatRole,
  message: string,
): Promise<AssistantReply> {
  if (!API_BASE_URL) {
    throw new Error("Set NEXT_PUBLIC_API_BASE_URL in the frontend environment.");
  }

  const response = await fetch(`${API_BASE_URL}/chat/${role}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      typeof result?.detail === "string"
        ? result.detail
        : `The assistant request failed (${response.status}).`,
    );
  }

  return result as AssistantReply;
}
