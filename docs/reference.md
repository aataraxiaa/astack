# AStack reference

Start with the [README](../README.md).

## Slash commands

The package includes 54 skill directories: 31 public skills and 23 `principle-*` references. Claude Code uses `/astack:<name>`. In Codex, request a skill by name or install the [optional shortcuts](#codex) for the `/name` form below.

Find each skill's instructions in the [skills tree](../plugins/astack/skills/).

| command | use it when |
| --- | --- |
| `/poteto-mode` | default entry point for any non-trivial task |
| `/how` | walk through how a subsystem works |
| `/why` | investigate why something was built this way (parallel multi-MCP evidence) |
| `/architect` | settle types and module shape before writing code that crosses a function boundary |
| `/arena` | run N parallel attempts at the same task and pick the best parts |
| `/interrogate` | have three different models try to break a diff |
| `/automate-me` | draft your own personal -mode skill from recent transcripts |
| `/reflect` | capture a long task's lessons as a skill edit |
| `/tdd` | fix a bug by writing the failing test first, then the fix |
| `/typescript-best-practices` | ground type-system discipline in TypeScript syntax |
| `/teach` | explain a subsystem plainly by composing how + why |
| `/swarm` | fan out N parallel workers across slices or races, then return one aggregated report |
| `/technical-writing` | write docs, RFCs, readmes, PR descriptions, and commit messages to one layered standard |
| `/bro` | restate the last message in plain human language, no jargon |
| `/figure-it-out` | design a rigorous, auditable playbook for a task no bundled playbook fits |
| `/show-me-your-work` | log decisions to a reviewable tsv decision trail |
| `/blast-radius` | find what a change could break beyond the diff and prove safety by running code |
| `/recall` | catch up on recent working context from chat history, live state, and the shared record |
| `/setup-pstack` | configure pstack per-role model choices |
| `/unslop` | clean up writing by removing AI tells |
| `/no-comments` | strip comments before review, fix the accepted findings, encode claimed constraints |
| `/create-verification-skill` | generate a project-local verification skill and feature map |
| `/maintain-verification-skill` | re-sync a drifted verification skill and its feature map |
| `/deslop` | deslop a diff before commit |
| `/babysit` | monitor an open PR, fix CI/comments, keep it merge-ready |
| `/thermo-nuclear-code-quality-review` | extremely strict maintainability audit |
| `/make-pr-easy-to-review` | clean noisy history and improve PR description before review |
| `/fix-ci` | find failing PR checks, inspect logs, apply focused fixes |
| `/fix-merge-conflicts` | non-interactively resolve merge conflicts, validate, finalize |
| `/get-pr-comments` | fetch and summarize review comments from the active PR |
| `/what-did-i-get-done` | summarize authored commits over a user-chosen period |

## Runtime support

Claude Code and Codex share one skills tree and have native manifests and routing hooks. Other runtimes are outside AStack's release support contract. Imported examples for other runtimes are historical reference, not tested support claims.

### Codex

Use the native marketplace installation in the [README](../README.md#codex). Request an installed skill by name. The [Codex mapping](../plugins/astack/skills/poteto-mode/references/codex-tools.md) maps workflow actions to available capabilities. Optional prompt stubs live in `.codex-plugin/prompts`; they are not required for native skill discovery.

### Automatic routing

Both manifests use the SessionStart hook. Review hook trust in the host. To disable routing, use `/astack:setup-pstack` on Claude or request setup-pstack on Codex and set `session hook: off`. AStack reads `astack-models.md` in that runtime's configuration directory.

## Configuration and dependencies

Use [setup-pstack](../plugins/astack/skills/setup-pstack/SKILL.md) to select available models. Defaults are in [models.json](../plugins/astack/models.json). A workflow cannot enable unavailable capabilities or extend user authorization.

Bun is needed for bundled scripts. GitHub workflows need authenticated `gh`; some inherited stack workflows use Graphite. AStack does not install tools or change global settings implicitly.

## Maintenance

See [upstream workflow](upstream.md), [adaptations](adaptations.md), and [CONTRIBUTING](../CONTRIBUTING.md). The command table above is the generator's source for Codex prompt descriptions; maintain one row per public skill.

The skill tree is synced against upstream `12d587d` (v0.15.5). The machine-readable pin in `tools/upstream.json` is authoritative. The update tool keeps this sentence current.

See [NOTICE](../NOTICE.md) and [LICENSE](../LICENSE) for attribution.
