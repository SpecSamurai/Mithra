import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getEvaluation, setEvaluationDecision } from "../api/evaluations";
import MessageList from "../components/chat/MessageList";
import StatusBadge from "../components/StatusBadge";
import type { Decision, Interview } from "../types";
import { formatDate } from "../format";

export default function InterviewReviewPage() {
  const { interviewId = "" } = useParams();
  const [interview, setInterview] = useState<Interview | null | undefined>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setInterview(null);
    setError(null);
    getEvaluation(interviewId)
      .then((row) => {
        if (!cancelled) setInterview(row);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setInterview(undefined);
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not load the evaluation.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [interviewId]);

  async function decide(decision: Decision) {
    setSaving(true);
    setError(null);
    try {
      setInterview(await setEvaluationDecision(interviewId, decision));
    } catch (reason: unknown) {
      setError(
        reason instanceof Error ? reason.message : "Could not save the decision.",
      );
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
        <p>{error ?? "Interview not found."}</p>
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
            {interview.jobTitle}
            {interview.conductedAt
              ? ` · ${formatDate(interview.conductedAt)}`
              : ""}
          </p>
        </div>
        <StatusBadge status={interview.status} />
      </div>

      <section className="card">
        <div className="card__title">
          <h2>Assessment</h2>
          <span className="score">
            {interview.score === null ? "—" : `${interview.score}/100`}
          </span>
        </div>
        <p>{interview.summary ?? "No assessment yet."}</p>
      </section>

      <section className="card card--flush">
        <h2 className="card__title">Transcript</h2>
        <MessageList
          messages={interview.transcript}
          userLabel={interview.candidateName}
          autoScroll={false}
        />
      </section>

      {error ? <p className="form-error">{error}</p> : null}

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
