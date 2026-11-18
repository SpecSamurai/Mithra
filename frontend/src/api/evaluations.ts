import type { Decision, Interview, InterviewStatus, Role } from "../types";

type ApiMessage = {
  id: string;
  text: string;
  user: "interviewer" | "candidate";
};

type ApiEvaluation = {
  id: string;
  status: InterviewStatus | null;
  candidate: string;
  job_offer: string;
  conducted_at: string | null;
  assessment: string | null;
  score: number | null;
  transcript: ApiMessage[];
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

function toInterview(row: ApiEvaluation): Interview {
  return {
    id: row.id,
    candidateName: row.candidate,
    jobTitle: row.job_offer,
    conductedAt: row.conducted_at,
    score: row.score,
    summary: row.assessment,
    status: row.status,
    transcript: row.transcript.map((message) => ({
      id: message.id,
      role: messageRole(message.user),
      text: message.text,
    })),
  };
}

export async function getEvaluations(): Promise<Interview[]> {
  const response = await fetch("/api/recruiter/evaluations");
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not load evaluations."));
  }
  const rows = (await response.json()) as ApiEvaluation[];
  return rows.map(toInterview);
}

export async function getEvaluation(id: string): Promise<Interview | undefined> {
  const response = await fetch(`/api/recruiter/evaluations/${id}`);
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not load the evaluation."));
  }
  return toInterview((await response.json()) as ApiEvaluation);
}

export async function setEvaluationDecision(
  id: string,
  decision: Decision,
): Promise<Interview | undefined> {
  const response = await fetch(`/api/recruiter/evaluations/${id}/${decision}`, {
    method: "POST",
  });
  if (response.status === 404) return undefined;
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not save the decision."));
  }
  return getEvaluation(id);
}
