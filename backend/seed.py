from uuid import UUID

from sqlalchemy import select

from backend.database.database import SessionLocal
from backend.database.models import JobOffer

job_offers = [
    JobOffer(
        public_id=UUID("a4e1c2b0-7d58-4f13-9a6e-2c8b5d1e0f47"),
        title="Backend Engineer (Python)",
        description=(
            "You will design and run the APIs and data services the product is built on. "
            "The work runs from a written plan through schema changes, domain logic, and a production rollout.\n\n"
            "What you will do:\n"
            "- Build and version HTTP APIs with FastAPI and Pydantic, including auth, error contracts, and changes that stay compatible for existing clients.\n"
            "- Design PostgreSQL schemas and migrations, and keep queries correct under concurrent writes.\n"
            "- Own asynchronous work: background jobs, retries, timeouts, and idempotent handling of duplicate or late events.\n"
            "- Integrate third-party services and keep the system recoverable when they time out or return bad data.\n"
            "- Run what you ship: structured logs, metrics, safe rollouts, and the debugging that follows an incident.\n"
            "- Review other people's changes and write down the decisions that shape the service.\n\n"
            "What you bring:\n"
            "- Several years of production Python, including asyncio.\n"
            "- Experience designing relational schemas and operating PostgreSQL.\n"
            "- A habit of automated tests around API and data changes.\n"
            "- Familiarity with Docker and a CI pipeline that builds, tests, and deploys the service."
        ),
    ),
    JobOffer(
        public_id=UUID("b81d4e62-3c90-4a27-8f15-6d2e9b0c4a73"),
        title="Frontend Engineer (React)",
        description=(
            "You will own the web application people actually use: the screens, the states around them, and the shared components other features are built from.\n\n"
            "What you will do:\n"
            "- Build accessible, responsive interfaces in React and TypeScript from product specs and design files.\n"
            "- Integrate REST APIs, including loading, empty, error, and permission states rather than only the happy path.\n"
            "- Extend a shared component set: tokens, keyboard behavior, and patterns other screens can reuse.\n"
            "- Keep the app fast: code splitting, avoiding unnecessary renders, and measuring what users wait on.\n"
            "- Cover important flows with unit and end-to-end tests, and review UI changes for regressions.\n"
            "- Pair with design and backend on API shape when the contract makes the interface clumsy.\n\n"
            "What you bring:\n"
            "- Strong React and TypeScript, including hooks, composition, and routing.\n"
            "- Solid HTML, CSS, and practical accessibility (WCAG): focus order, labels, and contrast.\n"
            "- Experience with a design system and with testing libraries such as Testing Library or Playwright.\n"
            "- Comfort explaining UI trade-offs to people who do not write frontend code."
        ),
    ),
    JobOffer(
        public_id=UUID("c5f0a193-8b24-4e76-91d3-7a1c4e8b2d60"),
        title="Machine Learning Engineer",
        description=(
            "You will take LLM features from a prototype to something we can ship, measure, and roll back. The job is the system around the model: retrieval, tools, evaluation, and production behavior.\n\n"
            "What you will do:\n"
            "- Build evaluation sets and rubrics for answers that do not have a single correct string, including regression checks when prompts, models, or tools change.\n"
            "- Trace real sessions so quality, latency, and cost can be inspected after launch, not only in a notebook.\n"
            "- Implement retrieval and tool-calling flows with explicit failure behavior when a source is slow, empty, or wrong.\n"
            "- Version prompts and model configuration so a bad change can be reproduced and reverted.\n"
            '- Work with product and backend on what "good" means for a feature before it is wired into the app.\n\n'
            "What you bring:\n"
            "- Production experience shipping Python services that call models, not only offline experiments.\n"
            "- A clear view of where LLM-as-judge grading fails, and how you check it against human labels.\n"
            "- Comfort with structured outputs, retrieval, and basic statistics on small evaluation sets.\n"
            "- Care for privacy: keeping candidate or customer content out of logs and training data by default."
        ),
    ),
    JobOffer(
        public_id=UUID("d29b7c84-1e56-4a08-b3f2-9c6d0a5e1b38"),
        title="Product Designer",
        description=(
            "You will own features from the first user conversation through the file engineering builds. Research, flows, and visual design are one job, not three handoffs.\n\n"
            "What you will do:\n"
            "- Plan and run interviews and usability tests, and fold product analytics into what you heard.\n"
            "- Turn findings into journeys, wireframes, and prototypes that include empty, loading, error, and edge states.\n"
            "- Design accessible interfaces in Figma against the existing design system, and add components when a pattern is missing.\n"
            "- Write the specs and review the built UI so what ships matches the intended behavior.\n"
            "- Present trade-offs to product and engineering with enough clarity that a decision can be made in the room.\n\n"
            "What you bring:\n"
            "- A portfolio of end-to-end case studies: the research, the options you rejected, and what shipped.\n"
            "- Hands-on Figma and experience contributing to a shared component library.\n"
            "- Working knowledge of WCAG and of designing responsive web layouts.\n"
            "- Examples of pairing with engineers during implementation, not only handing off a file."
        ),
    ),
    JobOffer(
        public_id=UUID("e63a1d75-4f82-4b19-8c40-0e7a2d9c5b16"),
        title="Product Manager",
        description=(
            "You will decide what the team builds next and why. That means writing the problem clearly, cutting scope, and staying with a feature until we know whether it worked.\n\n"
            "What you will do:\n"
            "- Talk to users and read support and usage data, then frame the problem before proposing a solution.\n"
            "- Write specs that engineering and design can build from: goal, non-goals, success metric, and the edge cases that matter.\n"
            "- Sequence a roadmap, make trade-offs explicit, and say no when a request does not move the metric.\n"
            "- Define how a launch will be measured, and review the result after release instead of moving on immediately.\n"
            "- Run the working rhythm of the team: priorities, open questions, and decisions recorded where people can find them.\n\n"
            "What you bring:\n"
            "- Experience shipping software with engineers and designers, including features you later changed or removed.\n"
            "- Comfort with lightweight analytics: funnels, cohorts, and knowing when a number is too small to trust.\n"
            "- Clear writing. Specs and updates should be readable by someone who missed the meeting.\n"
            "- Judgment about AI products: where a model helps, and where a deterministic flow is the better product."
        ),
    ),
]


def seed() -> None:
    with SessionLocal() as session, session.begin():
        for job_offer in job_offers:
            exists = session.scalar(
                select(JobOffer).where(JobOffer.public_id == job_offer.public_id)
            )
            if exists is None:
                session.add(job_offer)


if __name__ == "__main__":
    seed()
