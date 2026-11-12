export type Role = "user" | "interviewer";

export type ChatMessage = {
  id: number;
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
  jobPositionId: string;
  jobTitle: string;
  conductedAt: string; // ISO date
  score: number; // 0-100
  summary: string;
  status: InterviewStatus;
  transcript: ChatMessage[];
};

export type ApplicationInput = {
  jobPositionId: string;
  fullName: string;
  cv: File;
};
