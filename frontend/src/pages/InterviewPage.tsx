import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useParams } from "react-router";
import {
  listInterviews,
  readMessages,
  sendCandidateMessage,
  startInterview,
  type AvailableInterview,
} from "../api/interviews";
import Composer from "../components/chat/Composer";
import MessageList from "../components/chat/MessageList";
import type { ChatMessage } from "../types";

function InterviewLobby() {
  const [name, setName] = useState("");
  const [lookupName, setLookupName] = useState<string | null>(null);
  const [interviews, setInterviews] = useState<AvailableInterview[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lookupName) return;
    let cancelled = false;
    setInterviews(null);
    setError(null);
    listInterviews(lookupName)
      .then((rows) => {
        if (!cancelled) setInterviews(rows);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setInterviews([]);
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not load interviews.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lookupName]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setLookupName(trimmed);
  }

  return (
    <div className="page page--content">
      <div className="page-heading">
        <h1>Interview</h1>
        <p>Enter the name on your application to see interviews you can start.</p>
      </div>
      <form className="form-card interview-lookup" onSubmit={handleSubmit}>
        <label htmlFor="candidate-name">Your name</label>
        <input
          id="candidate-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Jane Doe"
        />
        <button type="submit" disabled={!name.trim()}>
          Find interviews
        </button>
      </form>
      {error ? <p className="form-error">{error}</p> : null}
      {lookupName && !interviews && !error ? (
        <p className="muted">Loading interviews…</p>
      ) : null}
      {interviews && interviews.length === 0 && !error ? (
        <p className="muted">No interviews for {lookupName}.</p>
      ) : null}
      {interviews && interviews.length > 0 ? (
        <ul className="interview-list">
          {interviews.map((interview) => (
            <li key={interview.id}>
              <Link
                className="interview-row"
                to={`/interview/${interview.id}`}
                state={{ candidateName: lookupName }}
              >
                <span className="interview-row__name">{interview.jobTitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function candidateNameFromState(state: unknown): string {
  if (
    state &&
    typeof state === "object" &&
    "candidateName" in state &&
    typeof state.candidateName === "string" &&
    state.candidateName.trim()
  ) {
    return state.candidateName;
  }
  return "Candidate";
}

export default function InterviewPage() {
  const { interviewId } = useParams();
  const candidateName = candidateNameFromState(useLocation().state);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!interviewId) return;
    const controller = new AbortController();
    let cancelled = false;
    setReady(false);
    setError(null);
    setMessages([]);

    startInterview(interviewId)
      .then(() => readMessages(interviewId, (message) => {
        if (cancelled) return;
        setMessages((current) =>
          current.some((item) => item.id === message.id)
            ? current
            : [...current, message],
        );
      }, controller.signal))
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((reason: unknown) => {
        if (cancelled || (reason instanceof DOMException && reason.name === "AbortError")) {
          return;
        }
        setError(
          reason instanceof Error ? reason.message : "Could not open the interview.",
        );
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [interviewId]);

  async function handleSend(text: string) {
    if (!interviewId) return;
    setSending(true);
    setError(null);
    try {
      const message = await sendCandidateMessage(interviewId, text);
      setMessages((current) => [...current, message]);
    } catch (reason: unknown) {
      setError(
        reason instanceof Error ? reason.message : "Could not send the message.",
      );
    } finally {
      setSending(false);
    }
  }

  if (!interviewId) {
    return <InterviewLobby />;
  }

  return (
    <div className="page page--chat">
      <header className="chat-header">
        <h1>Interview</h1>
        <p>{candidateName}</p>
      </header>
      <div className="chat-thread">
        {error ? <p className="form-error">{error}</p> : null}
        {ready && messages.length === 0 ? (
          <p className="muted chat-empty">No messages yet.</p>
        ) : null}
        <MessageList messages={messages} userLabel={candidateName} />
      </div>
      <Composer onSend={(text) => void handleSend(text)} disabled={!ready || sending} />
    </div>
  );
}
