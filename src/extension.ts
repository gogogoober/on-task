import * as vscode from "vscode";
import * as fs from "fs";
import { TaskPilotFileWatcher } from "./services/fileWatcher";
import { TaskPilotSidebarProvider } from "./providers/sidebarProvider";
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

  // 4. Register sidebar provider
  const provider = new TaskPilotSidebarProvider(watcher, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("taskpilot.dashboard", provider)
  );

  // 5. Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("taskpilot.init", () => {
      ensureDirectories(workspaceRoot);
      ensureGitignore(workspaceRoot);
      vscode.window.showInformationMessage("TaskPilot initialized. Create a TOML file in .taskpilot/branches/ to get started.");
    }),
    vscode.commands.registerCommand("taskpilot.refresh", () => watcher.refresh())
  );

  console.log("TaskPilot activated");
}

export function deactivate() {}
