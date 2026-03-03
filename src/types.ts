// TypeScript interfaces for TaskPilot

export type TaskStatus = "todo" | "in-progress" | "done" | "blocked";

export interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
  order: number;
  context: string;
  notes: string[];
  files: string[];
  completed_at?: string;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  order: number;
  is_original_scope: boolean;
  context: string;
  notes: string[];
  files: string[];
  discovered_during?: string;
  completed_at?: string;
  subtasks: Subtask[];
}

export interface OutOfScopeItem {
  id: string;
  title: string;
  context: string;
  notes: string[];
  files: string[];
}

export interface TicketMeta {
  ticket: string;
  title: string;
  branch: string;
  statement: string;
  created: string;
}

export interface TaskPilotState {
  meta: TicketMeta;
  tasks: Task[];
  out_of_scope: OutOfScopeItem[];
}

export interface DashboardStats {
  totalItems: number;
  doneItems: number;
  progressPercent: number;
  scopeDriftCount: number;
  outOfScopeCount: number;
}

// Kept for webview rendering
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
