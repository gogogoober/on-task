// Webview HTML builder

import { TaskPilotState, DashboardStats, BurndownPoint } from "../types";
import { getStyles } from "./styles";
import {
  renderEmptyState,
  renderHeaderSummary,
  renderStatementOfWork,
  renderCard,
  renderOutOfScopeList,
  renderBurndownChart,
  renderDivider,
  renderFooter,
} from "./components";

function getPlaceholderBurndown(stats: DashboardStats): BurndownPoint[] {
  const total = stats.totalItems;
  const done = stats.doneItems;
  const remaining = total - done;
  const drift = stats.scopeDriftCount;

  if (total === 0) return [];

  return [
    { label: "Start", remaining: total - drift, added: 0 },
    { label: "Now", remaining, added: drift },
  ];
}

function getWebviewScript(): string {
  return `(function() {
  const vscode = acquireVsCodeApi();

  document.addEventListener('click', function(e) {
    var target = e.target;

    // Walk up to find the element with data-action
    while (target && target !== document && !target.dataset.action) {
      target = target.parentElement;
    }
    if (!target || !target.dataset) return;

    var action = target.dataset.action;

    // ── Toggle task card body ──
    if (action === 'toggle-task') {
      var card = target.closest('.tp-card');
      if (!card) return;
      var body = card.querySelector('.tp-expandable-body');
      if (body) {
        body.classList.toggle('tp-expandable-body--open');
        var chevron = target.querySelector('.tp-expandable-chevron');
        if (chevron) chevron.classList.toggle('tp-expandable-chevron--open');
      }
      return;
    }

    // ── Toggle subtask details ──
    if (action === 'toggle-subtask') {
      var wrapper = target.closest('.tp-subtask-wrapper');
      if (!wrapper) return;
      var details = wrapper.querySelector('.tp-subtask-details');
      if (details) details.classList.toggle('tp-hidden');
      return;
    }

    // ── Toggle expandable sections ──
    if (action === 'toggle-expandable') {
      var expandable = target.closest('.tp-expandable');
      if (!expandable) return;
      var expBody = expandable.querySelector('.tp-expandable-body');
      if (expBody) {
        expBody.classList.toggle('tp-expandable-body--open');
        var chev = target.querySelector('.tp-expandable-chevron');
        if (chev) chev.classList.toggle('tp-expandable-chevron--open');
      }
      return;
    }

    // ── Toggle statement of work ──
    if (action === 'toggle-sow') {
      var sow = document.getElementById('sow-content');
      if (sow) sow.classList.toggle('tp-hidden');
      return;
    }

    // ── Copy prompt ──
    if (action === 'copy-prompt') {
      e.stopPropagation();
      var btn = target.closest('.tp-star-btn') || target;
      var taskId = btn.dataset.taskId;
      var subtaskId = btn.dataset.subtaskId;
      var promptType = btn.dataset.promptType;

      vscode.postMessage({
        type: promptType === 'plan' ? 'copy-plan' : 'copy-build',
        taskId: taskId,
        subtaskId: subtaskId
      });

      // Visual feedback
      var originalHtml = btn.innerHTML;
      btn.innerHTML = '<span class="tp-star-btn__label">ok</span>';
      btn.classList.add('tp-star-btn--ok');
      setTimeout(function() {
        btn.innerHTML = originalHtml;
        btn.classList.remove('tp-star-btn--ok');
      }, 1200);
      return;
    }

    // ── Open file ──
    if (action === 'open-file') {
      e.stopPropagation();
      var filePath = target.dataset.filePath;
      if (filePath) {
        vscode.postMessage({ type: 'open-file', filePath: filePath });
      }
      return;
    }
  });
})();`;
}

export function buildDashboardHtml(
  state: TaskPilotState | null,
  stats: DashboardStats | null,
  nonce: string,
  branch?: string
): string {
  const css = getStyles();
  const js = getWebviewScript();

  let body: string;

  if (!state || !stats) {
    body = renderEmptyState(branch);
  } else {
    const headerSection = renderHeaderSummary(state.meta, stats);
    const sowSection = renderStatementOfWork(state.meta.statement);

    // Task cards — in-progress tasks start expanded
    const taskCards = state.tasks
      .map(task => renderCard(task, task.status === "in-progress"))
      .join("");

    const outOfScope = renderOutOfScopeList(state.out_of_scope);

    // Burndown with placeholder data
    const burndownPoints = getPlaceholderBurndown(stats);
    const burndownSection = `<div class="tp-section">
  <div class="tp-section-header">
    <span class="tp-label">Progress</span>
  </div>
  ${renderBurndownChart(burndownPoints)}
</div>`;

    body = `<div class="tp-sidebar">
  <div class="tp-section">
    <div class="tp-section-header">
      <span class="tp-label">TaskPilot</span>
    </div>
    ${headerSection}
  </div>
  ${sowSection}
  ${renderDivider()}
  <div class="tp-section">
    ${taskCards}
  </div>
  ${outOfScope ? renderDivider() + outOfScope : ""}
  ${renderDivider()}
  ${burndownSection}
  <div class="tp-spacer"></div>
  ${renderFooter()}
</div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
  <style nonce="${nonce}">${css}</style>
</head>
<body>
  ${body}
  <script nonce="${nonce}">${js}</script>
</body>
</html>`;
}
