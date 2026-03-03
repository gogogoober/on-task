// Ensure .taskpilot/ is in .gitignore

import * as fs from "fs";
import * as path from "path";

const ENTRY = ".taskpilot/";

export function ensureGitignore(workspaceRoot: string): void {
  const gitignorePath = path.join(workspaceRoot, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, "utf-8");
    // Check if any line already covers .taskpilot/
    const lines = content.split("\n").map(l => l.trim());
    if (lines.includes(ENTRY) || lines.includes(".taskpilot")) {
      return;
    }
    // Append entry, ensuring a newline before it
    const suffix = content.endsWith("\n") ? "" : "\n";
    fs.writeFileSync(gitignorePath, content + suffix + ENTRY + "\n", "utf-8");
  } else {
    fs.writeFileSync(gitignorePath, ENTRY + "\n", "utf-8");
  }
}
