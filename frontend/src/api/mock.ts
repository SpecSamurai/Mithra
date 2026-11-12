import type {
  ApplicationInput,
  Decision,
  Interview,
  JobPosition,
} from "../types";

// Mock API. Replace these functions with real fetch calls once the backend
// exposes the corresponding endpoints.

const jobPositions: JobPosition[] = [
  {
    id: "backend-python",
    title: "Backend Engineer (Python)",
    description: "Build APIs with FastAPI and design data pipelines.",
  },
  {
    id: "frontend-react",
    title: "Frontend Engineer (React)",
    description: "Own the web app UI, built with React and TypeScript.",
  },
  {
    id: "ml-engineer",
    title: "ML Engineer",
    description: "Ship LLM-powered features and evaluation tooling.",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    description: "Design end-to-end product experiences.",
  },
];

let interviews: Interview[] = [
  {
    id: "1",
    candidateName: "Anna Kowalska",
    jobPositionId: "backend-python",
    jobTitle: "Backend Engineer (Python)",
    conductedAt: "2026-11-10T10:15:00Z",
    score: 84,
    summary:
      "Strong grasp of async Python and API design. Clear communication; limited experience with message queues.",
    status: "pending",
    transcript: [
      { id: 0, role: "interviewer", text: "Hello Anna. Can you describe a FastAPI service you built recently?" },
      { id: 1, role: "user", text: "I built an order-tracking API with FastAPI, Postgres and background tasks for notifications." },
      { id: 2, role: "interviewer", text: "How did you handle slow downstream calls?" },
      { id: 3, role: "user", text: "I used httpx with timeouts and retries, and moved the slow parts into background jobs." },
    ],
  },
  {
    id: "2",
    candidateName: "Tom Becker",
    jobPositionId: "frontend-react",
    jobTitle: "Frontend Engineer (React)",
    conductedAt: "2026-11-09T14:40:00Z",
    score: 67,
    summary:
      "Solid React fundamentals. Struggled to explain state management trade-offs.",
    status: "pending",
    transcript: [
      { id: 0, role: "interviewer", text: "Hi Tom. When would you reach for a global state library?" },
      { id: 1, role: "user", text: "Mostly when many components need the same data, otherwise I keep it local." },
      { id: 2, role: "interviewer", text: "What are the downsides of putting everything in context?" },
      { id: 3, role: "user", text: "I'm not sure, maybe it gets harder to read?" },
    ],
  },
  {
    id: "3",
    candidateName: "Priya Nair",
    jobPositionId: "ml-engineer",
    jobTitle: "ML Engineer",
    conductedAt: "2026-11-08T09:00:00Z",
    score: 91,
    summary:
      "Excellent understanding of LLM evaluation and agent graphs. Very good fit.",
    status: "approved",
    transcript: [
      { id: 0, role: "interviewer", text: "Hello Priya. How would you evaluate an LLM-based interviewer?" },
      { id: 1, role: "user", text: "A rubric-based judge plus a human-labelled set to calibrate it, tracked over time." },
    ],
  },
  {
    id: "4",
    candidateName: "Marco Rossi",
    jobPositionId: "product-designer",
    jobTitle: "Product Designer",
    conductedAt: "2026-11-07T16:20:00Z",
    score: 42,
    summary: "Portfolio lacks end-to-end case studies. Answers were vague.",
    status: "rejected",
    transcript: [
      { id: 0, role: "interviewer", text: "Hi Marco. Walk me through a project from research to launch." },
      { id: 1, role: "user", text: "I mostly worked on visual design, research was done by another team." },
    ],
  },
];

function delay<T>(value: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function getJobPositions(): Promise<JobPosition[]> {
  return delay(jobPositions);
}

export function submitApplication(input: ApplicationInput): Promise<void> {
  console.info("Mock application submitted", {
    jobPositionId: input.jobPositionId,
    fullName: input.fullName,
    cv: input.cv.name,
  });
  return delay(undefined, 600);
}

export function getInterviews(): Promise<Interview[]> {
  return delay(interviews);
}

export function getInterview(id: string): Promise<Interview | undefined> {
  return delay(interviews.find((interview) => interview.id === id));
}

export function setInterviewDecision(
  id: string,
  decision: Decision,
): Promise<Interview | undefined> {
  interviews = interviews.map((interview) =>
    interview.id === id ? { ...interview, status: decision } : interview,
  );
  return getInterview(id);
}
