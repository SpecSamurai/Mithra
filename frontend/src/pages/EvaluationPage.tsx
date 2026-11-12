import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getInterviews } from "../api/mock";
import StatusBadge from "../components/StatusBadge";
import { formatDate } from "../format";
import type { Interview, InterviewStatus } from "../types";

type Filter = "all" | InterviewStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function EvaluationPage() {
  const [interviews, setInterviews] = useState<Interview[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    getInterviews().then(setInterviews);
  }, []);

  const visible =
    interviews?.filter((i) => filter === "all" || i.status === filter) ?? [];

  return (
    <div className="page page--content">
      <div className="page-heading">
        <h1>Evaluation</h1>
        <p>Review conducted interviews and approve or reject candidates.</p>
      </div>

      <div className="tabs" role="tablist">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            className={`tab${filter === f.value ? " tab--active" : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!interviews ? (
        <p className="muted">Loading interviews…</p>
      ) : visible.length === 0 ? (
        <p className="muted">No interviews to show.</p>
      ) : (
        <ul className="interview-list">
          {visible.map((interview) => (
            <li key={interview.id}>
              <Link className="interview-row" to={`/evaluation/${interview.id}`}>
                <div className="interview-row__main">
                  <span className="interview-row__name">{interview.candidateName}</span>
                  <span className="muted">
                    {interview.jobTitle} · {formatDate(interview.conductedAt)}
                  </span>
                  <span className="interview-row__summary">{interview.summary}</span>
                </div>
                <div className="interview-row__meta">
                  <span className="score">{interview.score}</span>
                  <StatusBadge status={interview.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
