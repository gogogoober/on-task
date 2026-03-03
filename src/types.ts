// TypeScript interfaces for TaskPilot

export type TaskStatus = "done" | "in-progress" | "todo" | "blocked";

export interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
  details?: string;
  filePaths?: string[];
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks: Subtask[];
  context?: string;
}

export interface Observation {
  id: string;
  text: string;
  severity: "red" | "yellow" | "green" | "blue";
}

export interface BurndownPoint {
  label: string;
  remaining: number;
  added: number;
}

export interface SidebarState {
  branch: string;
  statementOfWork: string;
  tasks: Task[];
  outOfScope: string[];
  rules: string[];
  observations: Observation[];
  burndown: BurndownPoint[];
}
