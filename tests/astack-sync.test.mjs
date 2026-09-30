import { expect, test } from "bun:test";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { syncComponent } from "../tools/sync.mjs";

for (const scenario of ["overlap", "removed-upstream"]) {
  test(`automatic sync preserves all files on ${scenario}`, () => {
    const root = mkdtempSync(join(tmpdir(), "astack-sync-"));
    try {
      for (const name of ["old", "next", "local"]) mkdirSync(join(root, name));
      const put = (dir, name, text) => writeFileSync(join(root, dir, name), text);
      put("old", "policy.md", "old\n");
      put("local", "policy.md", "apple adaptation\n");
      if (scenario === "overlap") put("next", "policy.md", "upstream change\n");
      put("old", "clean.md", "before\n");
      put("local", "clean.md", "before\n");
      put("next", "clean.md", "after\n");
      const report = syncComponent({
        oldDir: join(root, "old"), newDir: join(root, "next"), localDir: join(root, "local"),
        rules: [], denylist: [], failOnConflict: true,
      });
      expect(report.conflicts).toHaveLength(1);
      expect(readFileSync(join(root, "local/policy.md"), "utf8")).toBe("apple adaptation\n");
      expect(readFileSync(join(root, "local/clean.md"), "utf8")).toBe("before\n");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
}
