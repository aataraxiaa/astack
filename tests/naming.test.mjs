import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { agentSkills } from "../tools/generate.mjs";
import { walk } from "../tools/validate-skills.mjs";
import { applySubstitutions, parseSubstitutions } from "../tools/sync.mjs";

const root = join(import.meta.dir, "..");
const plugin = join(root, "plugins/astack");

test("shipped runtime names use AStack except explicit provenance and checkpoint compatibility", () => {
  const allowed = new Map([
    ["README.md", /PStack-derived|pstack-claude is the attributed/],
    ["assets/astack-icon.prompt.txt", /pstack-claude/],
    ["skills/poteto-help/SKILL.md", /Original \[PStack sources\]/],
    ["skills/poteto-mode/references/licenses/NOTICE.md", /pstack-derived|pstack-claude/],
    ["skills/poteto-mode/references/resume-storage.md", /For compatibility with earlier releases/],
    ["skills/poteto-mode/scripts/resume.mjs", /store = join\(project.gitDir, 'pstack', 'resume'\)/],
  ]);
  const stale = [];
  for (const file of walk(plugin)) {
    if (!/\.(?:md|mjs|ts|json|sh|txt)$/.test(file)) continue;
    const rel = relative(plugin, file);
    for (const [index, line] of readFileSync(file, "utf8").split("\n").entries()) {
      if (/\bpstack\b/i.test(line) && !allowed.get(rel)?.test(line)) stale.push(`${rel}:${index + 1}: ${line}`);
    }
  }
  expect(stale).toEqual([]);
  const names = agentSkills(join(plugin, "skills")).map(({ name }) => name);
  expect(names).toContain("setup-astack");
  expect(names).not.toContain("setup-pstack");
});

test("branding adaptation preserves original source identities", () => {
  const { substitutions } = parseSubstitutions(JSON.parse(readFileSync(join(root, "tools/substitutions.json"), "utf8")));
  const source = "Run /setup-pstack with a pstack skill from plugins/pstack. Source: [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack). Port: https://github.com/michael-denyer/pstack-claude.";
  expect(applySubstitutions(source, substitutions).text).toBe(
    "Run /setup-astack with an AStack skill from plugins/astack. Source: [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack). Port: https://github.com/michael-denyer/pstack-claude.",
  );
});
