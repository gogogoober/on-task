// Assemble clipboard prompts

import { Task, Subtask, TaskPilotState } from "../types";

function formatNotes(notes: string[]): string {
  if (notes.length === 0) return "(none)";
  return notes.map(n => `- ${n}`).join("\n");
}

function formatFiles(files: string[]): string {
  if (files.length === 0) return "(none identified yet)";
  return files.join("\n");
}

function formatSiblings(task: Task, activeSubtaskId: string): string {
  if (task.subtasks.length <= 1) return "(no other subtasks)";
  return task.subtasks
    .map(s => {
      const marker = s.id === activeSubtaskId ? "  \u2190 you are here" : "";
      return `- [${s.status}] ${s.title}${marker}`;
    })
    .join("\n");
}

function findTaskAndSubtask(
  state: TaskPilotState,
  subtaskId: string
): { task: Task; subtask: Subtask } | null {
  for (const task of state.tasks) {
    for (const sub of task.subtasks) {
      if (sub.id === subtaskId) {
        return { task, subtask: sub };
      }
    }
  }
  return null;
}

export function buildPlanPrompt(
  state: TaskPilotState,
  subtaskId: string
): string | null {
  const found = findTaskAndSubtask(state, subtaskId);
  if (!found) return null;
  const { task, subtask } = found;

  return `## Background (for context only \u2014 do not implement)
Parent task: ${task.title}
${task.context}
Parent notes:
${formatNotes(task.notes)}

## Other subtasks in this parent (for awareness, not action)
These are the other pieces of work planned under this parent task.
Do not implement any of these. They are here so your analysis
accounts for where this subtask fits in the bigger picture.
${formatSiblings(task, subtask.id)}

## Active Subtask (this is what we are analyzing)
${subtask.title}
${subtask.context}

## Existing notes
${formatNotes(subtask.notes)}

## Known files
${formatFiles(subtask.files)}

## What I need from you
Analyze this subtask. Stay focused on THIS subtask only.

Give me a summary I can scan quickly:
- Bullet points, short and direct
- If I want more detail on anything, I will ask
- If this is the first time analyzing this subtask, be thorough but concise
- If we have already discussed this and are iterating, skip what has not changed \u2014 only cover what is new or different

Then break your questions into:
\ud83d\udd34 Must answer \u2014 blocks implementation
\ud83d\udfe1 Should answer \u2014 affects the approach
\ud83d\udfe2 Quick clarification \u2014 safe to assume defaults

If you see potential improvements, optimizations, or adjacent work
that is not part of this subtask, do not fold it into your plan.
Instead, list it separately at the end and ask:
"Should I add these as new subtasks?"`;
}

export function buildBuildPrompt(
  state: TaskPilotState,
  subtaskId: string
): string | null {
  const found = findTaskAndSubtask(state, subtaskId);
  if (!found) return null;
  const { task, subtask } = found;

  return `## Background (for context only \u2014 do not implement)
Parent task: ${task.title}
${task.context}
Parent notes:
${formatNotes(task.notes)}

## Other subtasks in this parent (for awareness, not action)
These exist so you understand the full scope and can write code that
fits into the bigger picture. Do not implement any of these \u2014 only
the active subtask below.
${formatSiblings(task, subtask.id)}

## Active Subtask (this is what you are implementing)
${subtask.title}
${subtask.context}

## Plan and decisions made during planning
${formatNotes(subtask.notes)}

## Suggested files (starting point, not exhaustive)
These were identified during planning as likely relevant.
You may touch other files if necessary, but stay focused.
${formatFiles(subtask.files)}

## Implementation guidelines
- Implement ONLY this specific subtask
- Do not refactor unrelated code
- Do not add features, variables, or abstractions not described above
- Do not build ahead into other subtasks
- Write readable, maintainable code
- Favor clarity over cleverness
- Follow existing patterns in the codebase
- Keep abstractions minimal \u2014 no premature optimization, no factory factories, no speculative generalization
- If a simple approach works, use it

## After you are done

### 1. Summary
Brief description of what you implemented and what changed.
Keep it scannable \u2014 I will read the diff for details.
When referencing code, use class names or component names,
not file paths or filenames with extensions.

### 2. Observations
Things you noticed during implementation, prioritized:

\ud83d\udd34 Must address \u2014 blocks progress or breaks functionality
- Runtime errors or type mismatches that will fail in production
  or during sibling subtask work
- Missing dependencies or broken contracts between modules

\ud83d\udfe1 Should address soon \u2014 affects quality or planned work
- Decisions that need to be made before continuing
- Coupling or architectural concerns that will compound

\ud83d\udfe2 Worth considering \u2014 not urgent
- Optimization opportunities you noticed but did not act on
- Patterns you would approach differently if revisiting

Focus on what matters. Do not include trivial style nits.
Only include a color level if there is something worth saying.

### 3. Suggested Subtasks
\ud83d\udd35 Based on your observations, suggest new subtasks grouped
   under their parent task. You may combine multiple related
   observations into a single subtask.

   {Parent Task Title}
   a) {subtask title}
      - {observation}
      - {observation}
   b) {subtask title}
      - {observation}

Do not add these to the TOML. I will tell you which to add,
e.g. "add a, c, e."

## Status resolution
If you believe this subtask is complete after implementation:
- If there are no red or yellow observations, ask me if I can mark it done
- If there are only yellow and green, use your judgment on whether to ask
- If there are any red observations, do not ask \u2014 there is still work to do`;
}
