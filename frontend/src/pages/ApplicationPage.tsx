import { useEffect, useState, type FormEvent } from "react";
import { getJobPositions, submitApplication } from "../api/offers";
import type { JobPosition } from "../types";

export default function ApplicationPage() {
  const [jobs, setJobs] = useState<JobPosition[] | null>(null);
  const [jobId, setJobId] = useState("");
  const [fullName, setFullName] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getJobPositions()
      .then((positions) => {
        if (!cancelled) setJobs(positions);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setJobs([]);
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not load job positions.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedJob = jobs?.find((job) => job.id === jobId);
  const canSubmit = Boolean(jobId && fullName.trim() && cv) && !submitting;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit || !cv) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitApplication({
        jobPositionId: jobId,
        fullName: fullName.trim(),
        cv,
      });
      setSubmitted(true);
    } catch (reason: unknown) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not submit the application.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="page page--center">
        <div className="form-card">
          <h1>Application sent</h1>
          <p>
            Thanks, {fullName.trim()}. Your application for{" "}
            <strong>{selectedJob?.title}</strong> has been received.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--apply">
      <div className="apply">
        <form className="form-card" onSubmit={handleSubmit}>
          <h1>Apply for a position</h1>
          <p>Select a job position and upload your CV.</p>

          <label htmlFor="job-position">Job position</label>
          <select
            id="job-position"
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
            disabled={!jobs}
          >
            <option value="" disabled>
              {jobs ? "Select a position…" : "Loading…"}
            </option>
            {jobs?.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <label htmlFor="full-name">Full name</label>
          <input
            id="full-name"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Jane Doe"
          />

          <label htmlFor="cv">CV</label>
          <label className="file-drop" htmlFor="cv">
            <input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => setCv(event.target.files?.[0] ?? null)}
            />
            <span>{cv ? cv.name : "Choose a file (PDF, DOC, DOCX)"}</span>
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button type="submit" disabled={!canSubmit}>
            {submitting ? "Submitting…" : "Submit application"}
          </button>
        </form>

        <aside className="job-brief" aria-live="polite">
          {selectedJob ? (
            <>
              <h2>{selectedJob.title}</h2>
              <div className="job-brief__body">{selectedJob.description}</div>
            </>
          ) : (
            <p className="muted">Select a position to read the full description.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
