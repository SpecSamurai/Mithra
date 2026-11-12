import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getInterview, setInterviewDecision } from "../api/mock";
import MessageList from "../components/chat/MessageList";
import StatusBadge from "../components/StatusBadge";
import type { Decision, Interview } from "../types";
import { formatDate } from "../format";

export default function InterviewReviewPage() {
  const { interviewId = "" } = useParams();
  const [interview, setInterview] = useState<Interview | null | undefined>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setInterview(null);
    getInterview(interviewId).then(setInterview);
  }, [interviewId]);

  async function decide(decision: Decision) {
    setSaving(true);
    try {
      setInterview(await setInterviewDecision(interviewId, decision));
    } finally {
      setSaving(false);
    }
  }

  if (interview === null) {
    return (
      <div className="page page--content">
        <p className="muted">Loading interview…</p>
      </div>
    );
  }

  if (interview === undefined) {
    return (
      <div className="page page--content">
        <Link className="back-link" to="/evaluation">← Back to interviews</Link>
        <p>Interview not found.</p>
      </div>
    );
  }

  return (
    <div className="page page--content">
      <Link className="back-link" to="/evaluation">← Back to interviews</Link>

      <div className="review-header">
        <div>
          <h1>{interview.candidateName}</h1>
          <p className="muted">
            {interview.jobTitle} · {formatDate(interview.conductedAt)}
          </p>
        </div>
        <StatusBadge status={interview.status} />
      </div>

      <section className="card">
        <div className="card__title">
          <h2>Assessment</h2>
          <span className="score">{interview.score}/100</span>
        </div>
        <p>{interview.summary}</p>
      </section>

      <section className="card card--flush">
        <h2 className="card__title">Transcript</h2>
        <MessageList
          messages={interview.transcript}
          userLabel={interview.candidateName}
          autoScroll={false}
        />
      </section>

      <div className="decision-bar">
        <button
          type="button"
          className="button--reject"
          disabled={saving || interview.status === "rejected"}
          onClick={() => decide("rejected")}
        >
          Reject
        </button>
        <button
          type="button"
          className="button--approve"
          disabled={saving || interview.status === "approved"}
          onClick={() => decide("approved")}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
