// HTML component builders

import { Task, Subtask, TaskStatus, Observation, BurndownPoint, OutOfScopeItem } from "../types";

// ── SVG Icons ──

const chevronSvg = `<svg class="tp-expandable-chevron" viewBox="0 0 16 16" fill="currentColor"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/></svg>`;

const chevronOpenSvg = `<svg class="tp-expandable-chevron tp-expandable-chevron--open" viewBox="0 0 16 16" fill="currentColor"><path d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z"/></svg>`;

const starSvg = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>`;

const lockSvg = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 1 0-5 0v2Z"/></svg>`;

// ── Helpers ──

function statusDotClass(status: TaskStatus): string {
  return `tp-status-dot tp-status-dot--${status}`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── 1 & 2. Card + Card Header ──

export function renderCard(task: Task, isExpanded: boolean): string {
  const done = task.subtasks.filter(s => s.status === "done").length;
  const total = task.subtasks.length;

  const subtaskRows = task.subtasks
    .map(sub => renderSubtaskRow(sub, task.id))
    .join("");

  const body = total > 0
    ? `<div class="tp-expandable-body${isExpanded ? " tp-expandable-body--open" : ""}">${subtaskRows}</div>`
    : "";

  return `<div class="tp-card" data-status="${task.status}" data-task-id="${task.id}">
  <div class="tp-card-header" data-action="toggle-task" data-task-id="${task.id}">
    ${renderCircularProgress(done, total, "sm")}
    <span class="tp-card-header-title tp-heading">${escapeHtml(task.title)}</span>
    ${isExpanded ? chevronOpenSvg : chevronSvg}
  </div>
  ${body}
</div>`;
}

// ── 3. Circular Progress ──

export function renderCircularProgress(done: number, total: number, size: "sm" | "lg"): string {
  const isSm = size === "sm";
  const dim = isSm ? 26 : 40;
  const strokeWidth = isSm ? 2 : 3;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = total > 0 ? done / total : 0;
  const offset = circumference * (1 - fraction);
  const isComplete = total > 0 && done === total;

  return `<div class="tp-progress-ring tp-progress-ring--${size}">
  <svg width="${dim}" height="${dim}" viewBox="0 0 ${dim} ${dim}">
    <circle class="tp-progress-ring__track"
      cx="${dim / 2}" cy="${dim / 2}" r="${radius}"
      stroke-width="${strokeWidth}" />
    <circle class="tp-progress-ring__fill${isComplete ? " tp-progress-ring__fill--complete" : ""}"
      cx="${dim / 2}" cy="${dim / 2}" r="${radius}"
      stroke-width="${strokeWidth}"
      stroke-dasharray="${circumference}"
      stroke-dashoffset="${offset}" />
  </svg>
  <span class="tp-progress-ring__text">${done}/${total}</span>
</div>`;
}

// ── 4. Status Dot ──

export function renderStatusDot(status: TaskStatus): string {
  return `<span class="${statusDotClass(status)}"></span>`;
}

// ── 5. Subtask Row ──

export function renderSubtaskRow(sub: Subtask, taskId: string): string {
  const inProgress = sub.status === "in-progress" ? " tp-subtask-row--in-progress" : "";

  return `<div class="tp-subtask-row${inProgress}" data-action="toggle-subtask" data-subtask-id="${sub.id}" data-task-id="${taskId}">
  ${renderStatusDot(sub.status)}
  <span class="tp-subtask-row-title tp-subheading">${escapeHtml(sub.title)}</span>
  <span class="tp-subtask-row-actions">
    ${renderStarButton(sub.id, "plan")}
    ${renderStarButton(sub.id, "build")}
  </span>
</div>`;
}

// ── 6. Expandable Section ──

export function renderExpandable(
  label: string,
  content: string,
  isOpen: boolean,
  id: string,
  badge?: number
): string {
  const badgeHtml = badge !== undefined
    ? ` ${renderBadge(badge)}`
    : "";

  return `<div class="tp-expandable" data-expandable-id="${id}">
  <div class="tp-expandable-header" data-action="toggle-expandable" data-expandable-id="${id}">
    ${isOpen ? chevronOpenSvg : chevronSvg}
    <span class="tp-label">${escapeHtml(label)}${badgeHtml}</span>
  </div>
  <div class="tp-expandable-body${isOpen ? " tp-expandable-body--open" : ""}">
    ${content}
  </div>
</div>`;
}

// ── 7. Star Button ──

export function renderStarButton(subtaskId: string, type: "plan" | "build"): string {
  return `<button class="tp-star-btn" data-action="copy-prompt" data-subtask-id="${subtaskId}" data-prompt-type="${type}" title="Copy ${type} prompt">
  ${starSvg}
</button>`;
}

// ── 8. Text Button ──

export function renderTextButton(label: string, action: string, dataAttrs?: string): string {
  return `<button class="tp-text-btn" data-action="${action}"${dataAttrs ? " " + dataAttrs : ""}>${escapeHtml(label)}</button>`;
}

// ── 9. Action Button ──

export function renderActionButton(
  label: string,
  action: string,
  variant: "primary" | "secondary" = "primary"
): string {
  return `<button class="tp-action-btn tp-action-btn--${variant}" data-action="${action}">${escapeHtml(label)}</button>`;
}

// ── 10. Input ──

export function renderInput(
  id: string,
  placeholder: string,
  value: string = "",
  rows: number = 3
): string {
  return `<textarea class="tp-input" id="${id}" placeholder="${escapeHtml(placeholder)}" rows="${rows}">${escapeHtml(value)}</textarea>`;
}

// ── 11. Section Divider ──

export function renderDivider(): string {
  return `<hr class="tp-divider" />`;
}

// ── 12. Badge ──

export function renderBadge(count: number): string {
  return `<span class="tp-badge">${count}</span>`;
}

// ── 13. Burndown Chart ──

export function renderBurndownChart(points: BurndownPoint[], width: number = 260, height: number = 80): string {
  if (points.length < 2) {
    return `<div class="tp-burndown"><span class="tp-caption">Not enough data for chart</span></div>`;
  }

  const pad = { top: 4, right: 4, bottom: 14, left: 4 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const maxVal = Math.max(...points.map(p => Math.max(p.remaining, p.added)), 1);

  function x(i: number): number {
    return pad.left + (i / (points.length - 1)) * w;
  }
  function y(val: number): number {
    return pad.top + h - (val / maxVal) * h;
  }

  const remainingLine = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.remaining).toFixed(1)}`).join(" ");
  const addedLine = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.added).toFixed(1)}`).join(" ");

  // Area fill under remaining line
  const areaPath = `${remainingLine} L${x(points.length - 1).toFixed(1)},${(pad.top + h).toFixed(1)} L${x(0).toFixed(1)},${(pad.top + h).toFixed(1)} Z`;

  // X-axis labels (first, middle, last)
  const labelIndices = [0, Math.floor(points.length / 2), points.length - 1];
  const labels = labelIndices.map(i =>
    `<text x="${x(i).toFixed(1)}" y="${height}" fill="var(--text-muted)" font-size="7" text-anchor="middle">${escapeHtml(points[i].label)}</text>`
  ).join("");

  return `<div class="tp-burndown">
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="burndown-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <path d="${areaPath}" fill="url(#burndown-fill)" />
    <path d="${remainingLine}" fill="none" stroke="var(--accent)" stroke-width="1.5" />
    <path d="${addedLine}" fill="none" stroke="var(--warning)" stroke-width="1" stroke-dasharray="3,2" />
    ${labels}
  </svg>
  <div class="tp-burndown-legend">
    <span><span class="tp-burndown-legend-dot" style="background:var(--accent)"></span>Remaining</span>
    <span><span class="tp-burndown-legend-dot" style="background:var(--warning)"></span>Added</span>
  </div>
</div>`;
}

// ── 14. Privacy Footer ──

export function renderFooter(): string {
  return `<div class="tp-footer">
  ${lockSvg}
  <span>All data stays local. Nothing is sent anywhere.</span>
</div>`;
}

// ── Compound: Observation Row ──

export function renderObservation(obs: Observation): string {
  return `<div class="tp-subtask-row">
  <span class="tp-status-dot" style="background:var(--obs-${obs.severity})"></span>
  <span class="tp-subtask-row-title tp-body">${escapeHtml(obs.text)}</span>
</div>`;
}

// ── Compound: Out-of-scope list ──

export function renderOutOfScopeList(items: OutOfScopeItem[]): string {
  if (items.length === 0) return "";
  const rows = items.map(item =>
    `<div class="tp-subtask-row"><span class="tp-caption">\u2022 ${escapeHtml(item.title)}</span></div>`
  ).join("");
  return renderExpandable("Out of scope", rows, false, "out-of-scope", items.length);
}

// ── Compound: Rules list ──

export function renderRulesList(rules: string[]): string {
  if (rules.length === 0) return "";
  const rows = rules.map(rule =>
    `<div class="tp-subtask-row"><span class="tp-caption">\u2022 ${escapeHtml(rule)}</span></div>`
  ).join("");
  return renderExpandable("Rules", rows, false, "rules", rules.length);
}
