#!/usr/bin/env bun
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { agentSkills, publicSkills } from "./generate.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const reports = resolve(process.argv[2] ?? "");
const rel = relative(root, reports);
assert(process.argv.length === 3 && (rel.startsWith("..") || isAbsolute(rel)), "Pass an evidence directory outside the repository");
mkdirSync(reports, { recursive: true });
const version = readFileSync(join(root, "VERSION"), "utf8").trim();
const plugin = join(root, "plugins/astack");
const manifest = JSON.parse(readFileSync(join(plugin, ".claude-plugin/plugin.json"), "utf8"));

function run(name, command, args) {
  try {
    const output = execFileSync(command, args, { cwd: root, encoding: "utf8", timeout: 180000, maxBuffer: 16 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
    writeFileSync(join(reports, name), output);
    return output;
  } catch (error) {
    writeFileSync(join(reports, name), `${error.stdout ?? ""}\n${error.stderr ?? ""}`);
    throw error;
  }
}

const claudeVersion = run("claude-version.txt", "claude", ["--version"]).trim();
const codexVersion = run("codex-version.txt", "codex", ["--version"]).trim();
const claudeRaw = JSON.parse(run("claude.json", "claude", [
  "-p", "/astack:bro Rewrite this clearly: We should leverage the existing implementation to facilitate a more robust outcome.",
  "--output-format", "json", "--max-turns", "4", "--allowedTools", "Skill,Read",
  "--permission-mode", "dontAsk", "--settings", JSON.stringify({ enabledPlugins: { "pstack@pstack-claude": false } }),
]));
const claudeEvents = Array.isArray(claudeRaw) ? claudeRaw : [claudeRaw];
const init = claudeEvents.find((e) => e.type === "system" && e.subtype === "init");
assert(init, "Claude must expose its native plugin inventory");
const installed = init.plugins.find((p) => p.source === "astack@astack");
assert.equal(installed?.version, version, "Claude loaded a different AStack release");
for (const name of publicSkills(join(plugin, "skills"))) assert(init.slash_commands.includes(`astack:${name}`), `Claude did not register ${name}`);
for (const agent of manifest.agents) {
  const name = agent.split("/").at(-1).replace(/\.md$/, "");
  assert(init.agents.includes(`astack:${name}`), `Claude did not register agent ${name}`);
}
const result = claudeEvents.find((e) => e.type === "result");
assert(result && !result.is_error && result.subtype === "success" && result.result.trim(), "Claude skill invocation failed");
assert.deepEqual(result.permission_denials ?? [], [], "Claude hit a permission failure");

const codexEvents = run("codex.jsonl", "codex", [
  "exec", "--ephemeral", "--sandbox", "read-only", "--json",
  "This is a bounded AStack installation smoke test. Use the installed astack bro skill to rewrite this sentence plainly: We should leverage the existing implementation to facilitate a more robust outcome. Read the skill from its installed location and follow it. Do not edit files, run other workflows, or delegate. Finish with the rewritten sentence and the exact skill path you loaded.",
]).split("\n").filter(Boolean).map((line) => JSON.parse(line));
assert(codexEvents.some((e) => e.type === "turn.completed"), "Codex did not complete the invocation");
assert(!codexEvents.some((e) => e.type === "turn.failed"), "Codex invocation failed");
const skillPath = `/plugins/cache/astack/astack/${version}/skills/bro/SKILL.md`;
assert(codexEvents.some((e) => e.item?.type === "command_execution" && e.item.exit_code === 0 && e.item.command.includes(skillPath) && e.item.aggregated_output.includes("name: bro")), "Codex did not read this release's installed skill");
assert(codexEvents.some((e) => e.item?.type === "agent_message" && e.item.text.includes(skillPath)), "Codex did not identify the installed skill it used");
writeFileSync(join(reports, "result.json"), JSON.stringify({ version, claudeVersion, codexVersion, skills: agentSkills(join(plugin, "skills")).length, publicCommands: publicSkills(join(plugin, "skills")).length, claudeAgents: manifest.agents.length, claude: "passed", codex: "passed", scope: "native registration and installed bro invocation; not exhaustive workflow behavior" }, null, 2) + "\n");
console.log(`AStack ${version}: Claude and Codex native smoke checks passed.`);
