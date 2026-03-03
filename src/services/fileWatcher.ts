// Watch .taskpilot/branches/

import * as vscode from "vscode";
import * as fs from "fs";
import { TaskPilotState } from "../types";
import { parseToml } from "./tomlParser";
import { getCurrentBranch, getTomlPath, getWatchGlob } from "./gitService";

export class TaskPilotFileWatcher implements vscode.Disposable {
  private readonly workspaceRoot: string;
  private currentBranch: string | undefined;
  private cachedState: TaskPilotState | null = null;
  private disposables: vscode.Disposable[] = [];
  private pollInterval: ReturnType<typeof setInterval> | undefined;

  private readonly _onStateChange = new vscode.EventEmitter<TaskPilotState | null>();
  readonly onStateChange: vscode.Event<TaskPilotState | null> = this._onStateChange.event;

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot;
  }

  start(): void {
    // Initial load
    this.currentBranch = getCurrentBranch(this.workspaceRoot);
    this.loadCurrentBranchToml();

    // Watch TOML files for changes
    const fsWatcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(this.workspaceRoot, getWatchGlob())
    );

    fsWatcher.onDidChange(() => this.onTomlFileChanged());
    fsWatcher.onDidCreate(() => this.onTomlFileChanged());
    fsWatcher.onDidDelete(() => this.onTomlFileChanged());
    this.disposables.push(fsWatcher);

    // Poll for branch changes
    this.startBranchPolling(3000);
  }

  dispose(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = undefined;
    }
    for (const d of this.disposables) {
      d.dispose();
    }
    this.disposables = [];
    this._onStateChange.dispose();
  }

  getCurrentState(): TaskPilotState | null {
    return this.cachedState;
  }

  getCurrentBranchName(): string | undefined {
    return this.currentBranch;
  }

  refresh(): void {
    this.currentBranch = getCurrentBranch(this.workspaceRoot);
    this.loadCurrentBranchToml();
  }

  private startBranchPolling(intervalMs: number): void {
    this.pollInterval = setInterval(() => {
      const branch = getCurrentBranch(this.workspaceRoot);
      if (branch !== this.currentBranch) {
        this.currentBranch = branch;
        this.loadCurrentBranchToml();
      }
    }, intervalMs);
  }

  private onTomlFileChanged(): void {
    // Re-load the current branch's TOML (the change may be to a different branch file,
    // but re-parsing is cheap so we keep it simple)
    this.loadCurrentBranchToml();
  }

  private loadCurrentBranchToml(): void {
    if (!this.currentBranch) {
      this.setState(null);
      return;
    }

    const tomlPath = getTomlPath(this.workspaceRoot, this.currentBranch);

    if (!fs.existsSync(tomlPath)) {
      this.setState(null);
      return;
    }

    try {
      const content = fs.readFileSync(tomlPath, "utf-8");
      const state = parseToml(content);
      this.setState(state);
    } catch (err) {
      console.warn(`TaskPilot: failed to parse ${tomlPath}:`, err);
      // Keep last good state on parse error
    }
  }

  private setState(state: TaskPilotState | null): void {
    this.cachedState = state;
    this._onStateChange.fire(state);
  }
}
