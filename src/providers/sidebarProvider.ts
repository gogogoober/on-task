// WebviewViewProvider

import * as vscode from "vscode";
import * as crypto from "crypto";
import { TaskPilotFileWatcher } from "../services/fileWatcher";
import { buildPlanPrompt, buildBuildPrompt } from "../services/promptBuilder";
import { computeStats } from "../services/tomlParser";
import { CURSOR_RULE, CLAUDE_MD_RULE, INIT_COMMAND, SYNC_COMMAND, ADD_COMMAND } from "../services/ruleContent";
import { buildDashboardHtml } from "../webview/index";

export class TaskPilotSidebarProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;
  private disposables: vscode.Disposable[] = [];

  constructor(
    private watcher: TaskPilotFileWatcher,
    private extensionContext: vscode.ExtensionContext
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
    };

    // Initial render
    this.render();

    // Re-render on state change
    const sub = this.watcher.onStateChange(() => this.render());
    this.disposables.push(sub);

    // Handle messages from the webview
    webviewView.webview.onDidReceiveMessage(
      (message) => this.handleMessage(message),
      undefined,
      this.disposables
    );

    // Cleanup when view is disposed
    webviewView.onDidDispose(() => {
      for (const d of this.disposables) {
        d.dispose();
      }
      this.disposables = [];
    });
  }

  private render(): void {
    if (!this.view) return;

    const state = this.watcher.getCurrentState();
    const stats = state ? computeStats(state) : null;
    const branch = this.watcher.getCurrentBranchName();
    const nonce = crypto.randomBytes(16).toString("hex");

    this.view.webview.html = buildDashboardHtml(state, stats, nonce, branch);
  }

  private async handleMessage(message: { type: string; taskId?: string; subtaskId?: string; filePath?: string }): Promise<void> {
    const state = this.watcher.getCurrentState();

    switch (message.type) {
      case "copy-plan": {
        if (!state || !message.subtaskId) return;
        const prompt = buildPlanPrompt(state, message.subtaskId);
        if (prompt) {
          await vscode.env.clipboard.writeText(prompt);
          vscode.window.setStatusBarMessage("Plan prompt copied", 2000);
        }
        break;
      }

      case "copy-build": {
        if (!state || !message.subtaskId) return;
        const prompt = buildBuildPrompt(state, message.subtaskId);
        if (prompt) {
          await vscode.env.clipboard.writeText(prompt);
          vscode.window.setStatusBarMessage("Build prompt copied", 2000);
        }
        break;
      }

      case "open-file": {
        if (!message.filePath) return;
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) return;
        const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, message.filePath);
        try {
          await vscode.window.showTextDocument(fileUri, { preview: true });
        } catch {
          vscode.window.showWarningMessage(`File not found: ${message.filePath}`);
        }
        break;
      }

      case "copy-cursor-rule": {
        await vscode.env.clipboard.writeText(CURSOR_RULE);
        vscode.window.setStatusBarMessage("Cursor rule copied — paste into .cursor/rules/taskpilot.mdc", 3000);
        break;
      }

      case "copy-claude-rule": {
        await vscode.env.clipboard.writeText(CLAUDE_MD_RULE);
        vscode.window.setStatusBarMessage("CLAUDE.md block copied \u2014 append to your CLAUDE.md", 3000);
        break;
      }

      case "copy-init-command": {
        await vscode.env.clipboard.writeText(INIT_COMMAND);
        vscode.window.setStatusBarMessage("/taskpilot-init copied \u2014 paste into .cursor/rules/taskpilot-init.mdc", 3000);
        break;
      }

      case "copy-sync-command": {
        await vscode.env.clipboard.writeText(SYNC_COMMAND);
        vscode.window.setStatusBarMessage("/taskpilot-sync copied \u2014 paste into .cursor/rules/taskpilot-sync.mdc", 3000);
        break;
      }

      case "copy-add-command": {
        await vscode.env.clipboard.writeText(ADD_COMMAND);
        vscode.window.setStatusBarMessage("/taskpilot-add copied \u2014 paste into .cursor/rules/taskpilot-add.mdc", 3000);
        break;
      }
    }
  }
}
