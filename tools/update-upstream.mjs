#!/usr/bin/env bun
import { execFileSync } from "node:child_process";
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const json = (path) => JSON.parse(read(path));

export function updateDecision(current, candidate) {
  if (!/^[0-9a-f]{40}$/.test(candidate.sha)) throw new Error("Upstream must resolve to a full commit SHA");
  const parse = (v) => {
    if (!/^\d+\.\d+\.\d+$/.test(v)) throw new Error(`Unsupported upstream version: ${v}`);
    return v.split(".").map(Number);
  };
  const before = parse(current.version);
  const after = parse(candidate.version);
  for (let i = 0; i < 3; i++) {
    if (after[i] < before[i]) throw new Error("Upstream version moved backwards; review required");
    if (after[i] > before[i]) break;
  }
  return candidate.sha !== current.sha;
}

async function github(path) {
  const headers = { Accept: "application/vnd.github+json" };
  if (process.env.GH_TOKEN) headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  const response = await fetch(`https://api.github.com/repos/cursor/plugins/${path}`, { headers });
  if (!response.ok) throw new Error(`Original upstream lookup failed: ${response.status}`);
  return response.json();
}

export async function latestOriginal() {
  const commits = await github("commits?path=pstack&sha=main&per_page=1");
  const sha = commits[0]?.sha;
  if (!/^[0-9a-f]{40}$/.test(sha ?? "")) throw new Error("Original upstream returned no immutable revision");
  const file = await github(`contents/pstack/.cursor-plugin/plugin.json?ref=${sha}`);
  const manifest = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  if (manifest.name !== "pstack") throw new Error("Original plugin identity changed; review required");
  return { sha, version: manifest.version };
}

function run(args, log) {
  try {
    const output = execFileSync(process.execPath, args, { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
    appendFileSync(log, output);
  } catch (error) {
    appendFileSync(log, error.stdout ?? "");
    appendFileSync(log, error.stderr ?? "");
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const apply = args[0] === "--apply";
  if (!["--check", "--apply"].includes(args[0]) || args[1] !== "--report-dir" || args.length !== 3) {
    throw new Error("Usage: bun tools/update-upstream.mjs --check|--apply --report-dir <external-directory>");
  }
  const reports = resolve(args[2]);
  if (reports === root.replace(/\/$/, "") || reports.startsWith(root)) throw new Error("Reports must be outside the repository");
  mkdirSync(reports, { recursive: true });
  const pins = json("tools/upstream.json");
  if (pins.remote !== "https://github.com/cursor/plugins" || pins.components.pstack.upstreamPath !== "pstack") {
    throw new Error("Release automation must track original cursor/plugins/pstack directly");
  }
  const provenance = json("tools/provenance.json");
  const current = { sha: pins.components.pstack.sha, version: provenance.upstreamVersion };
  const candidate = await latestOriginal();
  const changed = updateDecision(current, candidate);
  const report = { current, candidate, changed, compare: `https://github.com/cursor/plugins/compare/${current.sha}...${candidate.sha}` };
  writeFileSync(join(reports, "upstream.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  if (changed && apply) {
    if (execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim()) {
      throw new Error("Apply requires a clean working tree; commit or preserve current work first");
    }
    run(["tools/sync.mjs", "pstack", candidate.sha, "--fail-on-conflict"], join(reports, "sync.log"));
    const parts = read("VERSION").trim().split(".").map(Number);
    if (parts.length !== 3 || parts.some((n) => !Number.isSafeInteger(n) || n < 0)) throw new Error("Invalid AStack version");
    parts[2]++;
    const version = parts.join(".");
    writeFileSync(join(root, "VERSION"), version + "\n");
    const entry = `## ${version} - Original PStack ${candidate.version}\n\nAdapted original cursor/plugins/pstack at ${candidate.sha}. See the upstream comparison and sync report for changed files.\n\n`;
    writeFileSync(join(root, "CHANGES.md"), read("CHANGES.md").replace("# AStack changes\n\n", "# AStack changes\n\n" + entry));
    provenance.astackRevision = candidate.version === current.version ? provenance.astackRevision + 1 : 0;
    provenance.upstreamVersion = candidate.version;
    writeFileSync(join(root, "tools/provenance.json"), JSON.stringify(provenance, null, 2) + "\n");
    writeFileSync(join(root, "docs/reference.md"), read("docs/reference.md").replace(/synced against upstream `[0-9a-f]+` \(v[^)]+\)/, `synced against upstream \`${candidate.sha}\` (v${candidate.version})`));
    run(["tools/generate.mjs"], join(reports, "generate.log"));
    console.log(`Prepared AStack ${version}; run all release checks before publication.`);
  }
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\nversion=${read("VERSION").trim()}\n`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
