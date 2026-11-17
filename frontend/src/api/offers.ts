import type { ApplicationInput, JobPosition } from "../types";

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

export async function getJobPositions(): Promise<JobPosition[]> {
  const response = await fetch("/api/offers");
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not load job positions."));
  }
  return response.json() as Promise<JobPosition[]>;
}

export async function submitApplication(input: ApplicationInput): Promise<void> {
  const body = new FormData();
  body.append("full_name", input.fullName);
  body.append("cv", input.cv);
  const response = await fetch(
    `/api/offers/${input.jobPositionId}/applications`,
    { method: "POST", body },
  );
  if (!response.ok) {
    throw new Error(await errorDetail(response, "Could not submit the application."));
  }
}
