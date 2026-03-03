import * as vscode from "vscode";
import * as fs from "fs";
import { TaskPilotFileWatcher } from "./services/fileWatcher";
import { ensureGitignore } from "./services/gitignoreManager";
import { getBranchesDir } from "./services/gitService";

function ensureDirectories(workspaceRoot: string): void {
  fs.mkdirSync(getBranchesDir(workspaceRoot), { recursive: true });
}

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) return;

  // 1. Ensure directories exist
  ensureDirectories(workspaceRoot);

  // 2. Manage gitignore
  ensureGitignore(workspaceRoot);

  // 3. Create file watcher (starts polling + watching)
  const watcher = new TaskPilotFileWatcher(workspaceRoot);
  watcher.start();
  context.subscriptions.push(watcher);

  // Log state changes for debugging
  watcher.onStateChange(state => {
    if (state) {
      console.log(`TaskPilot: loaded ${state.meta.title || "untitled"} (${state.tasks.length} tasks)`);
    } else {
      console.log("TaskPilot: no TOML file for current branch");
    }
  });

  // 4. Register sidebar provider (next step)
  // const provider = new SidebarProvider(watcher, context);
  // ...

  // 5. Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("taskpilot.refresh", () => watcher.refresh())
  );

  console.log("TaskPilot activated");
}

export function deactivate() {}
