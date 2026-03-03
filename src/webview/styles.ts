// CSS as template literal (design system)

export function getStyles(): string {
  return `
    :root {
      /* Backgrounds */
      --bg-primary: #0d1117;
      --bg-secondary: #010409;
      --bg-surface: rgba(255,255,255,0.02);
      --bg-surface-hover: rgba(255,255,255,0.04);
      --bg-input: rgba(255,255,255,0.03);

      /* Text */
      --text-primary: rgba(255,255,255,0.88);
      --text-secondary: rgba(255,255,255,0.55);
      --text-muted: rgba(255,255,255,0.3);
      --text-disabled: rgba(255,255,255,0.15);

      /* Status */
      --status-done: #3fb950;
      --status-in-progress: #58a6ff;
      --status-todo: #484f58;
      --status-blocked: #f85149;

      /* Semantic */
      --accent: #58a6ff;
      --warning: #d29922;
      --border: rgba(255,255,255,0.06);
      --border-active: rgba(88,166,255,0.3);

      /* Observation colors */
      --obs-red: #f85149;
      --obs-yellow: #d29922;
      --obs-green: #3fb950;
      --obs-blue: #58a6ff;

      /* Spacing */
      --sp-1: 4px;
      --sp-2: 8px;
      --sp-3: 12px;
      --sp-4: 16px;

      /* Font stacks */
      --font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
    }

    /* ── Reset ── */

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: var(--bg-primary);
      color: var(--text-secondary);
      font-family: var(--font-sans);
      font-size: 11px;
      line-height: 1.45;
      overflow-x: hidden;
    }

    /* ── Typography ── */

    .tp-heading {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .tp-subheading {
      font-size: 11px;
      font-weight: 600;
      color: var(--text-secondary);
      line-height: 1.3;
    }

    .tp-label {
      font-size: 9px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .tp-body {
      font-size: 11px;
      font-weight: 400;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    .tp-caption {
      font-size: 10px;
      font-weight: 400;
      color: var(--text-muted);
      line-height: 1.4;
    }

    .tp-mono {
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 400;
      color: rgba(88,166,255,0.55);
    }

    /* ── Utility ── */

    .tp-hidden {
      display: none !important;
    }

    .tp-sidebar {
      padding: var(--sp-2);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .tp-section {
      margin-bottom: var(--sp-3);
    }

    .tp-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--sp-1) 0;
      margin-bottom: var(--sp-1);
    }

    .tp-flex-1 {
      flex: 1;
    }

    .tp-spacer {
      flex: 1;
    }

    /* ── Empty State ── */

    .tp-empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      gap: var(--sp-2);
    }

    .tp-empty-state-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
    }

    .tp-empty-state-hint {
      font-size: 10px;
      color: var(--text-disabled);
    }

    /* ── Header Summary ── */

    .tp-header-summary {
      display: flex;
      align-items: center;
      gap: var(--sp-3);
      padding: var(--sp-2) 0;
    }

    .tp-header-info {
      flex: 1;
      min-width: 0;
    }

    .tp-header-meta {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* ── Scope Drift Tag ── */

    .tp-scope-tag {
      display: inline-flex;
      align-items: center;
      padding: 0 5px;
      border-radius: 3px;
      background: rgba(210,153,34,0.12);
      color: var(--warning);
      font-size: 8px;
      font-weight: 600;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      line-height: 14px;
      margin-left: 6px;
    }

    /* ── 1. Card ── */

    .tp-card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      margin-bottom: var(--sp-1);
      overflow: hidden;
    }

    .tp-card[data-status="done"]        { border-left: 2px solid var(--status-done); }
    .tp-card[data-status="in-progress"] { border-left: 2px solid var(--status-in-progress); }
    .tp-card[data-status="todo"]        { border-left: 2px solid var(--status-todo); }
    .tp-card[data-status="blocked"]     { border-left: 2px solid var(--status-blocked); }

    /* ── 2. Card Header ── */

    .tp-card-header {
      display: flex;
      align-items: center;
      gap: var(--sp-2);
      padding: 6px 8px;
      cursor: pointer;
      user-select: none;
    }

    .tp-card-header:hover {
      background: var(--bg-surface-hover);
    }

    .tp-card-header-title {
      flex: 1;
      min-width: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* ── 3. Circular Progress ── */

    .tp-progress-ring {
      flex-shrink: 0;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tp-progress-ring--sm {
      width: 26px;
      height: 26px;
    }

    .tp-progress-ring--lg {
      width: 40px;
      height: 40px;
    }

    .tp-progress-ring svg {
      position: absolute;
      top: 0;
      left: 0;
    }

    .tp-progress-ring__track {
      fill: none;
      stroke: var(--border);
    }

    .tp-progress-ring__fill {
      fill: none;
      stroke: var(--accent);
      stroke-linecap: round;
      transform: rotate(-90deg);
      transform-origin: center;
      transition: stroke-dashoffset 0.3s ease;
    }

    .tp-progress-ring__fill--complete {
      stroke: var(--status-done);
    }

    .tp-progress-ring__text {
      font-size: 8px;
      font-weight: 600;
      color: var(--text-muted);
      position: relative;
      z-index: 1;
      pointer-events: none;
    }

    .tp-progress-ring--lg .tp-progress-ring__text {
      font-size: 10px;
    }

    /* ── 4. Status Dot ── */

    .tp-status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .tp-status-dot--done        { background: var(--status-done); }
    .tp-status-dot--in-progress { background: var(--status-in-progress); }
    .tp-status-dot--todo        { background: var(--status-todo); }
    .tp-status-dot--blocked     { background: var(--status-blocked); }

    /* ── 5. Subtask Row ── */

    .tp-subtask-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: var(--sp-1) 6px;
      cursor: pointer;
      user-select: none;
    }

    .tp-subtask-row:hover {
      background: var(--bg-surface-hover);
    }

    .tp-subtask-row--in-progress {
      background: rgba(88,166,255,0.04);
    }

    .tp-subtask-row--in-progress:hover {
      background: rgba(88,166,255,0.07);
    }

    .tp-subtask-row-title {
      flex: 1;
      min-width: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tp-subtask-row-actions {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
    }

    /* ── Subtask Details ── */

    .tp-subtask-details {
      padding: 2px 6px 6px 17px;
    }

    .tp-subtask-details-context {
      margin-bottom: 4px;
    }

    .tp-subtask-details-note {
      padding-left: 6px;
    }

    .tp-subtask-details-file {
      padding: 1px 0;
      cursor: pointer;
    }

    .tp-subtask-details-file:hover {
      text-decoration: underline;
    }

    /* ── 6. Expandable ── */

    .tp-expandable-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      cursor: pointer;
      user-select: none;
    }

    .tp-expandable-header:hover {
      background: var(--bg-surface-hover);
    }

    .tp-expandable-chevron {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
      transition: transform 0.15s ease;
      color: var(--text-muted);
    }

    .tp-expandable-chevron--open {
      transform: rotate(90deg);
    }

    .tp-expandable-body {
      display: none;
      padding: 0 8px 6px 8px;
    }

    .tp-expandable-body--open {
      display: block;
    }

    /* ── 7. Star Button ── */

    .tp-star-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 18px;
      border: 1px solid var(--border);
      border-radius: 3px;
      background: transparent;
      cursor: pointer;
      color: var(--text-muted);
      padding: 0;
      transition: all 0.15s ease;
    }

    .tp-star-btn:hover {
      border-color: var(--border-active);
      color: var(--accent);
      background: rgba(88,166,255,0.06);
    }

    .tp-star-btn--ok {
      border-color: rgba(63,185,80,0.3);
      color: var(--status-done);
      background: rgba(63,185,80,0.08);
    }

    .tp-star-btn svg {
      width: 10px;
      height: 10px;
    }

    .tp-star-btn__label {
      font-size: 8px;
      font-weight: 600;
    }

    /* ── 8. Text Button ── */

    .tp-text-btn {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border: 1px solid var(--border);
      border-radius: 3px;
      background: transparent;
      color: var(--text-muted);
      font-family: var(--font-sans);
      font-size: 10px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .tp-text-btn:hover {
      border-color: var(--border-active);
      color: var(--text-secondary);
      background: var(--bg-surface-hover);
    }

    /* ── 9. Action Button ── */

    .tp-action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--sp-1);
      padding: 4px 12px;
      border: none;
      border-radius: 4px;
      font-family: var(--font-sans);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .tp-action-btn:hover {
      opacity: 0.85;
    }

    .tp-action-btn--primary {
      background: var(--accent);
      color: #0d1117;
    }

    .tp-action-btn--secondary {
      background: var(--bg-surface);
      color: var(--text-muted);
      border: 1px solid var(--border);
    }

    .tp-action-btn--secondary:hover {
      color: var(--text-secondary);
      border-color: var(--border-active);
    }

    /* ── 10. Input ── */

    .tp-input {
      width: 100%;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 4px;
      color: var(--text-secondary);
      font-family: var(--font-sans);
      font-size: 11px;
      line-height: 1.45;
      padding: 6px 8px;
      outline: none;
      resize: vertical;
      box-sizing: border-box;
      transition: border-color 0.15s ease;
    }

    .tp-input:focus {
      border-color: var(--border-active);
    }

    .tp-input::placeholder {
      color: var(--text-disabled);
    }

    /* ── 11. Section Divider ── */

    .tp-divider {
      border: none;
      border-top: 1px solid var(--border);
      margin-top: var(--sp-3);
      padding-top: var(--sp-3);
    }

    /* ── 12. Badge ── */

    .tp-badge {
      display: inline-flex;
      align-items: center;
      padding: 0 5px;
      border-radius: 5px;
      background: rgba(255,255,255,0.05);
      font-size: 9px;
      font-weight: 500;
      color: var(--text-muted);
      line-height: 16px;
    }

    /* ── 13. Burndown (SVG inline, tokens only) ── */

    .tp-burndown {
      padding: var(--sp-2);
    }

    .tp-burndown-legend {
      display: flex;
      gap: var(--sp-3);
      margin-top: var(--sp-1);
      font-size: 9px;
      color: var(--text-muted);
    }

    .tp-burndown-legend-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 4px;
      vertical-align: middle;
    }

    /* ── 14. Privacy Footer ── */

    .tp-footer {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: var(--sp-2) var(--sp-2) var(--sp-3);
      font-size: 8.5px;
      color: var(--text-disabled);
    }

    .tp-footer svg {
      width: 10px;
      height: 10px;
      flex-shrink: 0;
    }
  `;
}
