// TOML → typed state

import { parse } from "smol-toml";
import {
  TaskStatus,
  Subtask,
  Task,
  OutOfScopeItem,
  TicketMeta,
  TaskPilotState,
  DashboardStats,
} from "../types";

const VALID_STATUSES: TaskStatus[] = ["todo", "in-progress", "done", "blocked"];

function toStatus(val: unknown): TaskStatus {
  if (typeof val === "string" && VALID_STATUSES.includes(val as TaskStatus)) {
    return val as TaskStatus;
  }
  return "todo";
}

function toStr(val: unknown, fallback: string = ""): string {
  if (val === undefined || val === null) return fallback;
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

function toStrArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(v => toStr(v));
  if (typeof val === "string") return [val];
  return [];
}

function toBool(val: unknown, fallback: boolean = false): boolean {
  if (typeof val === "boolean") return val;
  return fallback;
}

function toNum(val: unknown, fallback: number = 0): number {
  if (typeof val === "number") return val;
  return fallback;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawTable = Record<string, any>;

function parseMeta(raw: RawTable | undefined): TicketMeta {
  if (!raw) {
    return { ticket: "", title: "", branch: "", statement: "", created: "" };
  }
  return {
    ticket: toStr(raw.ticket),
    title: toStr(raw.title),
    branch: toStr(raw.branch),
    statement: toStr(raw.statement),
    created: toStr(raw.created),
  };
}

function parseSubtask(id: string, raw: RawTable): Subtask {
  return {
    id,
    title: toStr(raw.title, id),
    status: toStatus(raw.status),
    order: toNum(raw.order, 0),
    context: toStr(raw.context),
    notes: toStrArray(raw.notes),
    files: toStrArray(raw.files),
    completed_at: raw.completed_at ? toStr(raw.completed_at) : undefined,
  };
}

function parseTask(id: string, raw: RawTable): Task {
  const subtasksRaw: RawTable = raw.subtasks || {};
  const subtasks: Subtask[] = Object.entries(subtasksRaw)
    .map(([subId, subRaw]) => parseSubtask(subId, subRaw as RawTable))
    .sort((a, b) => a.order - b.order);

  return {
    id,
    title: toStr(raw.title, id),
    status: toStatus(raw.status),
    order: toNum(raw.order, 0),
    is_original_scope: toBool(raw.is_original_scope, true),
    context: toStr(raw.context),
    notes: toStrArray(raw.notes),
    files: toStrArray(raw.files),
    discovered_during: raw.discovered_during
      ? toStr(raw.discovered_during)
      : undefined,
    completed_at: raw.completed_at ? toStr(raw.completed_at) : undefined,
    subtasks,
  };
}

function parseOutOfScopeItem(id: string, raw: RawTable): OutOfScopeItem {
  return {
    id,
    title: toStr(raw.title, id),
    context: toStr(raw.context),
    notes: toStrArray(raw.notes),
    files: toStrArray(raw.files),
  };
}

export function parseToml(tomlString: string): TaskPilotState {
  const raw = parse(tomlString) as RawTable;

  const meta = parseMeta(raw.meta);

  const tasksRaw: RawTable = raw.tasks || {};
  const tasks: Task[] = Object.entries(tasksRaw)
    .map(([id, taskRaw]) => parseTask(id, taskRaw as RawTable))
    .sort((a, b) => a.order - b.order);

  const oosRaw: RawTable = raw.out_of_scope || {};
  const out_of_scope: OutOfScopeItem[] = Object.entries(oosRaw).map(
    ([id, itemRaw]) => parseOutOfScopeItem(id, itemRaw as RawTable)
  );

  return { meta, tasks, out_of_scope };
}

export function computeStats(state: TaskPilotState): DashboardStats {
  let totalItems = 0;
  let doneItems = 0;
  let scopeDriftCount = 0;

  for (const task of state.tasks) {
    if (!task.is_original_scope) {
      scopeDriftCount++;
    }

    if (task.subtasks.length === 0) {
      // Task with no subtasks counts as one item
      totalItems++;
      if (task.status === "done") doneItems++;
    } else {
      for (const sub of task.subtasks) {
        totalItems++;
        if (sub.status === "done") doneItems++;
      }
    }
  }

  const progressPercent =
    totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return {
    totalItems,
    doneItems,
    progressPercent,
    scopeDriftCount,
    outOfScopeCount: state.out_of_scope.length,
  };
}
