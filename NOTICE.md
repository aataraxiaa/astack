# AStack attribution

AStack adapts original PStack by Lauren Tan for Claude Code and Codex. Its initial portability code and tests were imported from Michael Denyer’s MIT-licensed pstack-claude at eefcfaf31343a0c98d4bf0dc74a55d62b35ce9f9. This is a one-time source import, not an update dependency. AStack modifications include packaging identity, Apple guidance, Codex capability mapping, and direct-upstream release tooling.

The original source pins are in tools/upstream.json. The following historical port notice is retained for attribution; references to that port’s release history describe the imported baseline.

# NOTICE

This plugin is a port of upstream MIT-licensed work. The port's modifications and additions are (c) 2026 Michael Denyer and are also released under the [MIT license](LICENSE). All upstream copyright notices and license terms are preserved.

## Upstream sources

| Component | Upstream | Copyright | License | License file |
| --- | --- | --- | --- | --- |
| `plugins/astack/skills/poteto-mode/`, `plugins/astack/skills/architect/`, `plugins/astack/skills/arena/`, `plugins/astack/skills/automate-me/`, `plugins/astack/skills/figure-it-out/`, `plugins/astack/skills/how/`, `plugins/astack/skills/interrogate/`, `plugins/astack/skills/reflect/`, `plugins/astack/skills/show-me-your-work/`, `plugins/astack/skills/tdd/`, `plugins/astack/skills/typescript-best-practices/`, `plugins/astack/skills/unslop/`, `plugins/astack/skills/why/`, `plugins/astack/skills/principle-*/`, `plugins/astack/agents/poteto-agent.md` | [cursor/plugins/astack @ e46364b](https://github.com/cursor/plugins/tree/e46364b8be46000b7df0f260550cd712afbb8d36/pstack) | (c) 2026 Lauren Tan | MIT | [LICENSE](LICENSE) |
| `plugins/astack/skills/deslop/` | [cursor/plugins/cursor-team-kit/skills/deslop @ e46364b](https://github.com/cursor/plugins/tree/e46364b8be46000b7df0f260550cd712afbb8d36/cursor-team-kit/skills/deslop) | (c) 2026 Cursor | MIT | [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit) |
| `plugins/astack/skills/thermo-nuclear-code-quality-review/` | [cursor/plugins/cursor-team-kit/skills/thermo-nuclear-code-quality-review @ e46364b](https://github.com/cursor/plugins/tree/e46364b8be46000b7df0f260550cd712afbb8d36/cursor-team-kit/skills/thermo-nuclear-code-quality-review) | (c) 2026 Cursor | MIT | [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit) |
| `plugins/astack/skills/make-pr-easy-to-review/` | [cursor/plugins/cursor-team-kit/skills/make-pr-easy-to-review @ e46364b](https://github.com/cursor/plugins/tree/e46364b8be46000b7df0f260550cd712afbb8d36/cursor-team-kit/skills/make-pr-easy-to-review) | (c) 2026 Cursor | MIT | [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit) |
| `plugins/astack/skills/fix-ci/` | [cursor/plugins/cursor-team-kit/skills/fix-ci @ e46364b](https://github.com/cursor/plugins/tree/e46364b8be46000b7df0f260550cd712afbb8d36/cursor-team-kit/skills/fix-ci) | (c) 2026 Cursor | MIT | [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit) |
| `plugins/astack/skills/fix-merge-conflicts/` | [cursor/plugins/cursor-team-kit/skills/fix-merge-conflicts @ e46364b](https://github.com/cursor/plugins/tree/e46364b8be46000b7df0f260550cd712afbb8d36/cursor-team-kit/skills/fix-merge-conflicts) | (c) 2026 Cursor | MIT | [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit) |
| `plugins/astack/skills/get-pr-comments/` | [cursor/plugins/cursor-team-kit/skills/get-pr-comments @ e46364b](https://github.com/cursor/plugins/tree/e46364b8be46000b7df0f260550cd712afbb8d36/cursor-team-kit/skills/get-pr-comments) | (c) 2026 Cursor | MIT | [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit) |
| `plugins/astack/skills/what-did-i-get-done/` | [cursor/plugins/cursor-team-kit/skills/what-did-i-get-done @ e46364b](https://github.com/cursor/plugins/tree/e46364b8be46000b7df0f260550cd712afbb8d36/cursor-team-kit/skills/what-did-i-get-done) | (c) 2026 Cursor | MIT | [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit) |
| `plugins/astack/skills/teach/`, `plugins/astack/skills/principle-model-the-domain/`, `plugins/astack/skills/create-verification-skill/`, `plugins/astack/skills/maintain-verification-skill/` (v0.11.3 additions) | [cursor/plugins/astack @ 3fe2823](https://github.com/cursor/plugins/tree/3fe2823ce17c1656c222d4b7c59d3f82fbf20143/pstack) | (c) 2026 Lauren Tan | MIT | [LICENSE](LICENSE) |
| `plugins/astack/skills/{swarm,no-comments,technical-writing,bro}/`, `plugins/astack/agents/comment-sicko.md`, `plugins/astack/skills/poteto-mode/playbooks/{babysit,shipping,orchestrate,autopilot-full,autopilot-stack,worktree-cleanup}.md`, `plugins/astack/skills/poteto-mode/references/bugbot-triage.md`, `plugins/astack/skills/poteto-mode/scripts/`, `plugins/astack/skills/architect/references/design-red-flags.md`, `plugins/astack/skills/create-verification-skill/references/feature-map-example/` (v0.14.2 additions) | [cursor/plugins/astack @ 4612556](https://github.com/cursor/plugins/tree/4612556/pstack) | (c) 2026 Lauren Tan | MIT | [LICENSE](LICENSE) |
| `plugins/astack/skills/poteto-mode/playbooks/multi-phase-plan.md`, `plugins/astack/skills/poteto-mode/scripts/check-plan.mjs` (v0.14.8 additions) | [cursor/plugins/astack @ 7314f72](https://github.com/cursor/plugins/tree/7314f72/pstack) | (c) 2026 Lauren Tan | MIT | [LICENSE](LICENSE) |
| `plugins/astack/skills/principle-attack-the-premise/`, `plugins/astack/skills/principle-test-behavior-not-implementation/` (post-v0.14.8 additions) | [cursor/plugins/astack @ e8d856f](https://github.com/cursor/plugins/tree/e8d856f/pstack) | (c) 2026 Lauren Tan | MIT | [LICENSE](LICENSE) |

## What changed in the port

The port is editorial, not mechanical. [CHANGES.md](CHANGES.md) records each release's changes, and [`tools/substitutions.json`](tools/substitutions.json) lists the token rewrites with the reason for each.

Summary of structural changes:

- Plugin content lives at `plugins/astack/` (with its own `.claude-plugin/plugin.json`). The repo root holds `.claude-plugin/marketplace.json` and the LICENSE / NOTICE / README / CHANGES docs.
- `.claude-plugin/marketplace.json` added at repo root so the repo is installable via `/plugin marketplace add`. The marketplace's single plugin entry sources from `./plugins/astack`.
- `plugins/astack/.codex-plugin/prompts/<name>.md` stubs added so each public skill is reachable as a slash command on Codex. Claude Code needs no stubs: the skill itself serves `/astack:<name>`.
- Seven skills imported from `cursor-team-kit`: `deslop`, `thermo-nuclear-code-quality-review`, `make-pr-easy-to-review`, `fix-ci`, `fix-merge-conflicts`, `get-pr-comments`, `what-did-i-get-done`. All copied verbatim — no rewiring needed.
- `plugins/astack/skills/babysit/` is independently authored as the Claude Code analog of Cursor's `/babysit` built-in. It has no upstream pstack equivalent; its workflow is informed by Cursor's public `/babysit` behavior. No code or prose was copied from any source.
- `plugins/astack/skills/poteto-mode/scripts/` is vendored from upstream (`watch-pr`, `orch`, `bootstrap.ts`, `package.json`, `bun.lock`). `worktree-audit.mjs` is a port-only rewrite of upstream's `worktree-audit.sh`, which `tools/upstream.json` excludes from sync; it reads `~/.claude/projects/` instead of Cursor's transcript directory and reports prunable worktrees. Port edits, each on the forked list `bun tools/sync.mjs --dry-run` prints: `bootstrap.ts` fails clearly under node and installs production dependencies only; `orch/store.ts` and `orch/orch.test.ts` carry the silent-failure fixes from #35; `package.json` typechecks the whole tree; `tsconfig.json` is port-only. Everything else is upstream's code under the upstream MIT license.
- `plugins/astack/agents/comment-sicko.md` is upstream's `Comment Sicko` agent, renamed to `comment-sicko` so the name works as a Claude Code `subagent_type`. The body is verbatim.
- A Codex build shares the same `skills/` tree. It adds `plugins/astack/.codex-plugin/plugin.json`, a root `.agents/plugins/marketplace.json`, and `plugins/astack/skills/poteto-mode/references/codex-tools.md` (the Claude-to-Codex tool, model, built-in, and per-skill map). Affected skill entry points link to this map so direct invocation works without the optional Codex prompt stubs. See the [reference](docs/reference.md#codex).

## Modifications

Per the MIT license, modifications are permitted. Skill bodies have been edited to substitute Cursor-specific primitives with their Claude Code equivalents (the substitution rules are in [`tools/substitutions.json`](tools/substitutions.json)). All upstream copyright notices in source files (where present) are preserved.

Port-authored files covered by this notice include:

- `plugins/astack/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json` (repo root)
- `plugins/astack/.codex-plugin/plugin.json`
- `.agents/plugins/marketplace.json` (repo root)
- `plugins/astack/skills/poteto-mode/references/codex-tools.md`
- `plugins/astack/.codex-plugin/prompts/*.md`
- `plugins/astack/skills/babysit/SKILL.md` (independently authored; workflow informed by Cursor's public `/babysit` behavior)
- `plugins/astack/hooks/hooks.json`, `plugins/astack/hooks/codex-hooks.json`, and `plugins/astack/hooks/session-start-context.md` (each runtime's auto-fire hook and its mandate)
- `NOTICE.md` (this file)
- `NOTICE-skills.md`
- `README.md`
- `CHANGES.md`

`LICENSE-cursor-team-kit` is copied verbatim from upstream cursor-team-kit rather than authored for this port.
