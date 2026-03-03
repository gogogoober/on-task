// Branch detection

import { execSync } from "child_process";
import * as path from "path";

export function getCurrentBranch(workspaceRoot: string): string | undefined {
  try {
    const result = execSync("git rev-parse --abbrev-ref HEAD", {
      cwd: workspaceRoot,
      timeout: 5000,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    }).trim();
    // Detached HEAD returns "HEAD"
    if (!result || result === "HEAD") return undefined;
    return result;
  } catch {
    return undefined;
  }
}

export function branchToFilename(branch: string): string {
  return branch.replace(/\//g, "--");
}

export function filenameToBranch(filename: string): string {
  return filename.replace(/--/g, "/");
}

export function getTaskpilotDir(workspaceRoot: string): string {
  return path.join(workspaceRoot, ".taskpilot");
}

export function getBranchesDir(workspaceRoot: string): string {
  return path.join(workspaceRoot, ".taskpilot", "branches");
}

export function getTomlPath(workspaceRoot: string, branch: string): string {
  return path.join(getBranchesDir(workspaceRoot), `${branchToFilename(branch)}.toml`);
}

export function getWatchGlob(): string {
  return "**/.taskpilot/branches/*.toml";
}
