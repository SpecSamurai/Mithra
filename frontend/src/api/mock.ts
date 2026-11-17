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
    description:
      "You will design and run the APIs and data services the product is built on. The work runs from a written plan through schema changes, domain logic, and a production rollout.\n\nWhat you will do:\n- Build and version HTTP APIs with FastAPI and Pydantic, including auth, error contracts, and changes that stay compatible for existing clients.\n- Design PostgreSQL schemas and migrations, and keep queries correct under concurrent writes.\n- Own asynchronous work: background jobs, retries, timeouts, and idempotent handling of duplicate or late events.\n- Integrate third-party services and keep the system recoverable when they time out or return bad data.\n- Run what you ship: structured logs, metrics, safe rollouts, and the debugging that follows an incident.\n- Review other people's changes and write down the decisions that shape the service.\n\nWhat you bring:\n- Several years of production Python, including asyncio.\n- Experience designing relational schemas and operating PostgreSQL.\n- A habit of automated tests around API and data changes.\n- Familiarity with Docker and a CI pipeline that builds, tests, and deploys the service.",
  },
  {
    id: "frontend-react",
    title: "Frontend Engineer (React)",
    description:
      "You will own the web application people actually use: the screens, the states around them, and the shared components other features are built from.\n\nWhat you will do:\n- Build accessible, responsive interfaces in React and TypeScript from product specs and design files.\n- Integrate REST APIs, including loading, empty, error, and permission states rather than only the happy path.\n- Extend a shared component set: tokens, keyboard behavior, and patterns other screens can reuse.\n- Keep the app fast: code splitting, avoiding unnecessary renders, and measuring what users wait on.\n- Cover important flows with unit and end-to-end tests, and review UI changes for regressions.\n- Pair with design and backend on API shape when the contract makes the interface clumsy.\n\nWhat you bring:\n- Strong React and TypeScript, including hooks, composition, and routing.\n- Solid HTML, CSS, and practical accessibility (WCAG): focus order, labels, and contrast.\n- Experience with a design system and with testing libraries such as Testing Library or Playwright.\n- Comfort explaining UI trade-offs to people who do not write frontend code.",
  },
  {
    id: "ml-engineer",
    title: "ML Engineer",
    description:
      "You will take LLM features from a prototype to something we can ship, measure, and roll back. The job is the system around the model: retrieval, tools, evaluation, and production behavior.\n\nWhat you will do:\n- Build evaluation sets and rubrics for answers that do not have a single correct string, including regression checks when prompts, models, or tools change.\n- Trace real sessions so quality, latency, and cost can be inspected after launch, not only in a notebook.\n- Implement retrieval and tool-calling flows with explicit failure behavior when a source is slow, empty, or wrong.\n- Version prompts and model configuration so a bad change can be reproduced and reverted.\n- Work with product and backend on what \"good\" means for a feature before it is wired into the app.\n\nWhat you bring:\n- Production experience shipping Python services that call models, not only offline experiments.\n- A clear view of where LLM-as-judge grading fails, and how you check it against human labels.\n- Comfort with structured outputs, retrieval, and basic statistics on small evaluation sets.\n- Care for privacy: keeping candidate or customer content out of logs and training data by default.",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    description:
      "You will own features from the first user conversation through the file engineering builds. Research, flows, and visual design are one job, not three handoffs.\n\nWhat you will do:\n- Plan and run interviews and usability tests, and fold product analytics into what you heard.\n- Turn findings into journeys, wireframes, and prototypes that include empty, loading, error, and edge states.\n- Design accessible interfaces in Figma against the existing design system, and add components when a pattern is missing.\n- Write the specs and review the built UI so what ships matches the intended behavior.\n- Present trade-offs to product and engineering with enough clarity that a decision can be made in the room.\n\nWhat you bring:\n- A portfolio of end-to-end case studies: the research, the options you rejected, and what shipped.\n- Hands-on Figma and experience contributing to a shared component library.\n- Working knowledge of WCAG and of designing responsive web layouts.\n- Examples of pairing with engineers during implementation, not only handing off a file.",
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description:
      "You will decide what the team builds next and why. That means writing the problem clearly, cutting scope, and staying with a feature until we know whether it worked.\n\nWhat you will do:\n- Talk to users and read support and usage data, then frame the problem before proposing a solution.\n- Write specs that engineering and design can build from: goal, non-goals, success metric, and the edge cases that matter.\n- Sequence a roadmap, make trade-offs explicit, and say no when a request does not move the metric.\n- Define how a launch will be measured, and review the result after release instead of moving on immediately.\n- Run the working rhythm of the team: priorities, open questions, and decisions recorded where people can find them.\n\nWhat you bring:\n- Experience shipping software with engineers and designers, including features you later changed or removed.\n- Comfort with lightweight analytics: funnels, cohorts, and knowing when a number is too small to trust.\n- Clear writing. Specs and updates should be readable by someone who missed the meeting.\n- Judgment about AI products: where a model helps, and where a deterministic flow is the better product.",
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
