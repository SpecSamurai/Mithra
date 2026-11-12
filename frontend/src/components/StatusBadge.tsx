import type { InterviewStatus } from "../types";

const labels: Record<InterviewStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function StatusBadge({ status }: { status: InterviewStatus }) {
  return <span className={`badge badge--${status}`}>{labels[status]}</span>;
}
