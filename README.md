# TaskPilot

A VSCode sidebar dashboard for AI-assisted coding sessions. TaskPilot gives you a persistent, structured view of your current task while you work with AI coding assistants like Cursor and Claude.

## How it works

```
AI assistant  -->  .taskpilot/branches/{branch}.toml  -->  TaskPilot extension  -->  Sidebar dashboard
```

1. You (or your AI assistant) create a TOML file describing your current feature work
2. The TOML contains tasks, subtasks, status, notes, and file references
3. TaskPilot watches the file and renders a live dashboard in the sidebar
4. As you work, your AI assistant updates the TOML. The dashboard updates automatically.

## Getting started

1. **Install the extension** from the VSCode marketplace (or load from `.vsix`)
2. **Initialize** -- run `TaskPilot: Initialize` from the command palette (`Cmd+Shift+P`). This creates the `.taskpilot/branches/` directory and adds `.taskpilot/` to your `.gitignore`.
3. **Set up your AI assistant** -- open the TaskPilot sidebar and use the copy buttons to install the Cursor rule or CLAUDE.md block.
4. **Create your first task file** -- use the `/taskpilot-init` Cursor command (or create a TOML file manually).

## Features

- **Live dashboard** -- progress rings, task cards, subtask details, and burndown chart, all updating as the TOML file changes
- **Branch-aware** -- automatically detects your git branch and loads the matching TOML file (`feature/auth` maps to `feature--auth.toml`)
- **Plan & Build prompts** -- one-click clipboard copy of structured prompts to paste into your AI assistant
- **Scope drift tracking** -- tasks discovered mid-work are tagged; out-of-scope items are tracked separately
- **Cursor rules & CLAUDE.md** -- built-in rule content you can copy into your AI assistant configuration
- **Slash commands** -- `/taskpilot-init`, `/taskpilot-sync`, `/taskpilot-add` command content ready to copy

## AI assistant setup

The sidebar includes copy buttons for:

| Button | What it does |
|--------|-------------|
| **Cursor Rule** | Always-on rule for TOML maintenance. Paste into `.cursor/rules/taskpilot.mdc` |
| **CLAUDE.md** | Equivalent rule block. Append to your `CLAUDE.md` |
| **/taskpilot-init** | Slash command to initialize a task file from a statement of work |
| **/taskpilot-sync** | Slash command to sync the TOML with current codebase state |
| **/taskpilot-add** | Slash command to add subtasks from conversation context |

## TOML schema

Task files live at `.taskpilot/branches/{branch}.toml` where branch slashes become `--`.

```toml
[meta]
ticket = "PROJ-123"
title = "Feature name"
branch = "feature/name"
statement = "Full statement of work text"
created = 2026-03-02T10:00:00Z

[tasks.my-task]
title = "Task title"
status = "todo"           # todo | in-progress | done | blocked
order = 1
is_original_scope = true
context = "What and why"
notes = ["short technical fragments"]
files = ["src/path/to/file.ts"]

  [tasks.my-task.subtasks.my-subtask]
  title = "Subtask title"
  status = "todo"
  order = 1
  context = "What and why"
  notes = []
  files = ["src/path/to/file.ts"]

[out_of_scope.future-work]
title = "Something for later"
context = "Why it's out of scope"
notes = ["relevant details"]
files = []
```

## Privacy

All data stays on your machine. TaskPilot reads local TOML files and renders them in a webview. No network requests. No telemetry. No external services.

## License

[MIT](LICENSE)
