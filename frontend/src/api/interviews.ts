import type { ChatMessage, Role } from "../types";

type ApiMessage = {
  id: string;
  text: string;
  user: "interviewer" | "candidate";
};

async function errorDetail(response: Response, fallback: string): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      body &&
      typeof body === "object" &&
      "detail" in body &&
      typeof body.detail === "string"
    ) {
      return body.detail;
    }
  } catch {
    // The response was not JSON.
  }
  return fallback;
}

function messageRole(user: ApiMessage["user"]): Role {
  return user === "candidate" ? "user" : "interviewer";
}

function toMessage(row: ApiMessage): ChatMessage {
  return { id: row.id, role: messageRole(row.user), text: row.text };
}

export type AvailableInterview = {
  id: string;
  jobTitle: string;
};

export async function listInterviews(candidate: string): Promise<AvailableInterview[]> {
  const response = await fetch(
    `/api/interviews?candidate=${encodeURIComponent(candidate)}`,
  );
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not load interviews."));
  }
  const rows = (await response.json()) as { id: string; job_offer: string }[];
  return rows.map((row) => ({ id: row.id, jobTitle: row.job_offer }));
}

export async function startInterview(id: string): Promise<void> {
  const response = await fetch(`/api/interviews/${id}/start`, { method: "POST" });
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not start the interview."));
  }
}

export async function sendCandidateMessage(
  interviewId: string,
  text: string,
): Promise<ChatMessage> {
  const message: ApiMessage = {
    id: crypto.randomUUID(),
    text,
    user: "candidate",
  };
  const body = new FormData();
  body.append("id", message.id);
  body.append("text", message.text);
  body.append("user", message.user);
  const response = await fetch(`/api/interviews/${interviewId}/messages`, {
    method: "PUT",
    body,
  });
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not send the message."));
  }
  return toMessage(message);
}

export async function readMessages(
  interviewId: string,
  onMessage: (message: ChatMessage) => void,
  signal: AbortSignal,
): Promise<void> {
  const response = await fetch(`/api/interviews/${interviewId}/messages`, { signal });
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not load messages."));
  }
  if (!response.body) return;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";

  const emitBlock = (block: string) => {
    const data = block
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n");
    if (!data) return;
    const parsed: unknown = JSON.parse(data);
    if (!parsed || typeof parsed !== "object") return;
    const record = parsed as { id?: unknown; text?: unknown; user?: unknown };
    if (
      typeof record.id !== "string" ||
      typeof record.text !== "string" ||
      (record.user !== "interviewer" && record.user !== "candidate")
    ) {
      return;
    }
    onMessage(toMessage({ id: record.id, text: record.text, user: record.user }));
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      pending += decoder.decode(value, { stream: true });
      const blocks = pending.split("\n\n");
      pending = blocks.pop() ?? "";
      for (const block of blocks) emitBlock(block);
    }
    if (pending.trim()) emitBlock(pending);
  } catch (reason: unknown) {
    if (reason instanceof DOMException && reason.name === "AbortError") return;
    throw reason;
  }
}
