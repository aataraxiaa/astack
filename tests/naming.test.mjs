import { expect, test } from "bun:test";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { agentSkills } from "../tools/generate.mjs";
import { walk } from "../tools/validate-skills.mjs";
import { tmpdir } from "node:os";
import { applySubstitutions, parseSubstitutions, syncComponent } from "../tools/sync.mjs";

const root = join(import.meta.dir, "..");
const plugin = join(root, "plugins/astack");

test("shipped runtime names use AStack except explicit provenance and checkpoint compatibility", () => {
  const allowed = new Map([
    ["README.md", /PStack-derived|pstack-claude is the attributed/],
    ["assets/astack-icon.prompt.txt", /pstack-claude/],
    ["skills/auto-help/SKILL.md", /Original \[PStack sources\]/],
    ["skills/auto/references/licenses/NOTICE.md", /pstack-derived|pstack-claude/],
    ["skills/auto/references/resume-storage.md", /For compatibility with earlier releases/],
    ["skills/auto/scripts/resume.mjs", /store = join\(project.gitDir, 'pstack', 'resume'\)/],
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
  const source = "Run /setup-pstack with a pstack skill from plugins/pstack. Source: [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack). Port: https://github.com/michael-denyer/pstack-claude. Original workflow: https://github.com/cursor/plugins/tree/main/pstack/skills/poteto-mode/SKILL.md. Author: https://github.com/poteto.";
  expect(applySubstitutions(source, substitutions).text).toBe(
    "Run /setup-astack with an AStack skill from plugins/astack. Source: [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack). Port: https://github.com/michael-denyer/pstack-claude. Original workflow: https://github.com/cursor/plugins/tree/main/pstack/skills/poteto-mode/SKILL.md. Author: https://github.com/poteto.",
  );
});

test("shipped workflow and routing expose only auto names", () => {
  const names = agentSkills(join(plugin, "skills")).map(({ name }) => name);
  expect(names).toContain("auto");
  expect(names).toContain("auto-help");
  for (const file of walk(plugin)) {
    expect(relative(plugin, file)).not.toMatch(/poteto/i);
    if (/\.(?:md|mjs|ts|json|sh|txt)$/.test(file)) {
      expect(readFileSync(file, "utf8")).not.toMatch(/poteto/i);
    }
  }
  expect(readFileSync(join(plugin, "hooks/session-start-context.md"), "utf8")).toContain("astack:auto");
  const manifest = JSON.parse(readFileSync(join(plugin, ".claude-plugin/plugin.json"), "utf8"));
  expect(manifest.agents).toContain("./agents/auto-agent.md");
  const mode = readFileSync(join(plugin, "skills/auto/SKILL.md"), "utf8");
  expect(mode).toContain('subagent_type: "astack:auto-agent"');
  expect(mode).toContain('subagent_type: "astack:auto-agent-<level>"');
  expect(readFileSync(join(plugin, "effort-agents/auto-agent-high.md"), "utf8")).toContain("name: auto-agent-high");
  expect(existsSync(join(plugin, "skills/poteto-mode"))).toBe(false);
});

test("sync translates original workflow paths and references into auto names", () => {
  const fixture = mkdtempSync(join(tmpdir(), "astack-auto-naming-"));
  const rules = JSON.parse(readFileSync(join(root, "tools/substitutions.json"), "utf8"));
  const { substitutions, denylist } = parseSubstitutions(rules);
  const source = {
    "skills/poteto-mode/SKILL.md": "# Poteto mode\nRun /poteto-mode and astack:poteto-agent-high.\n",
    "skills/poteto-help/SKILL.md": "Read ../poteto-mode/SKILL.md and run /poteto-help.\n",
    "agents/poteto-agent.md": "name: poteto-agent\nRead poteto-mode.\n",
  };
  try {
    for (const dir of ["old", "next", "local"]) mkdirSync(join(fixture, dir));
    for (const [path, text] of Object.entries(source)) {
      mkdirSync(dirname(join(fixture, "next", path)), { recursive: true });
      writeFileSync(join(fixture, "next", path), text);
    }
    const report = syncComponent({
      oldDir: join(fixture, "old"), newDir: join(fixture, "next"), localDir: join(fixture, "local"),
      rules: substitutions, denylist, pathRenames: rules.pathRenames, failOnConflict: true,
    });
    expect(report.conflicts).toEqual([]);
    expect(report.written.map(({ rel }) => rel).sort()).toEqual([
      "agents/auto-agent.md", "skills/auto-help/SKILL.md", "skills/auto/SKILL.md",
    ]);
    expect(readFileSync(join(fixture, "local/skills/auto/SKILL.md"), "utf8")).toBe("# Auto mode\nRun /auto and astack:auto-agent-high.\n");
    expect(readFileSync(join(fixture, "local/skills/auto-help/SKILL.md"), "utf8")).toBe("Read ../auto/SKILL.md and run /auto-help.\n");
    expect(readFileSync(join(fixture, "local/agents/auto-agent.md"), "utf8")).toBe("name: auto-agent\nRead auto.\n");
    expect(existsSync(join(fixture, "local/skills/poteto-mode"))).toBe(false);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
