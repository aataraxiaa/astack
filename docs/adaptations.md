# AStack adaptations

The maintained source is original PStack in cursor/plugins. The initial translation tooling, native manifests, hooks, and tests reuse MIT-licensed work from Michael Denyer's pstack-claude at the exact commit recorded in `tools/provenance.json`. That repository is never fetched by the update pipeline.

| Layer | Source of truth | Update behavior |
| --- | --- | --- |
| Original workflows | `tools/upstream.json` | Fetch original source at an immutable commit and compare with the previous pin. |
| Mechanical translation | `tools/substitutions.json` | Apply named text rewrites and `pathRenames` to both old and new source before three-way comparison. |
| Deliberate divergence | `tools/forks.json` | Preserve non-overlapping edits; fail validation on conflicts or undeclared differences. |
| Maintenance instructions | `docs/maintenance.md`, `docs/maintenance-prompt.md`, `docs/workflow.md` | AStack owns the portable runbook, scheduler prompt, and diagrams. Host settings and credentials stay outside Git. |
| Native packaging | Harness manifests, marketplaces, hooks, `tools/generate.mjs` | Share one skills tree and validate each harness's packaging. |
| Public documentation and branding | `README.md`, `docs/assets/astack-logo.png` | AStack owns its installation guide and logo independently of upstream. |
| Release identity | `VERSION`, `CHANGES.md`, `tools/provenance.json` | AStack uses its own semver and records the upstream version and commit separately. |

The bootstrap retains the port reference's declared policy forks as well as its mechanical compatibility work. Those are visible in `tools/forks.json`; they are not represented as original PStack behavior. Review them individually before changing them rather than silently discarding mature workflows.

The `pathRenames` map translates upstream `skills/setup-pstack`, `skills/poteto-mode`, `skills/poteto-help`, and `agents/poteto-agent.md` into local `skills/setup-astack`, `skills/auto`, `skills/auto-help`, and `agents/auto-agent.md`. Substitution file scopes keep their upstream paths. Generation, fork declarations, and sync reports use local paths. Unsafe paths or colliding destinations stop sync before it writes.

AStack uses the `astack:` plugin namespace and `astack-models.md` configuration. The main workflow is `auto`, its wrapper is `auto-agent`, and its help skill is `auto-help`; model and routing setup uses `setup-astack`. Claude invokes `/astack:auto` and `/astack:setup-astack`. Mechanical branding and workflow path renames are applied during upstream translation. Original PStack names remain in source attribution, upstream paths, and legacy checkpoint compatibility.

The Codex adapter uses available tools and model capabilities rather than assuming that every Codex surface exposes the same tool names. User and project instructions take precedence over all plugin guidance.

New functionality should be placed in the smallest applicable layer. Platform-specific preferences belong in the consuming project’s instructions. When fixing a portability defect, add a behavioral fixture to the existing tests and make the translation reproducible.

AStack owns `plugins/astack/skills/auto/references/verification-drivers.md`. It centralizes instruction-based selection of local and installed plugin drivers and separates the active product checkout, editable driver source, and installed runtime cache. The creator, maintainer, help, and Codex mapping use this policy. External drivers stay in their own plugin source repository and use native installation.
