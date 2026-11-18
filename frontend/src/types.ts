export type Role = "user" | "interviewer";

export type ChatMessage = {
  id: string;
  role: Role;
  text: string;
};

export type JobPosition = {
  id: string;
  title: string;
  description: string;
};

export type InterviewStatus = "pending" | "approved" | "rejected";

export type Decision = Exclude<InterviewStatus, "pending">;

export type Interview = {
  id: string;
  candidateName: string;
  jobTitle: string;
  conductedAt: string | null;
  score: number | null;
  summary: string | null;
  status: InterviewStatus | null;
  transcript: ChatMessage[];
};

export type ApplicationInput = {
  jobPositionId: string;
  fullName: string;
  cv: File;
};
