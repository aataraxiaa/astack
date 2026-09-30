# AStack adaptations

The maintained source is original PStack in cursor/plugins. The initial translation tooling, native manifests, hooks, and tests reuse MIT-licensed work from Michael Denyer's pstack-claude at the exact commit recorded in `tools/provenance.json`. That repository is never fetched by the update pipeline.

| Layer | Source of truth | Update behavior |
| --- | --- | --- |
| Original workflows | `tools/upstream.json` | Fetch original source at an immutable commit and compare with the previous pin. |
| Mechanical translation | `tools/substitutions.json` | Apply named rewrites to both old and new source before three-way comparison. |
| Deliberate divergence | `tools/forks.json` | Preserve non-overlapping edits; fail validation on conflicts or undeclared differences. |
| Apple guidance | `plugins/astack/skills/poteto-mode/references/apple-development.md` | AStack owns this file; the main workflow and session hook route Apple work to it. |
| Native packaging | Harness manifests, marketplaces, hooks, `tools/generate.mjs` | Share one skills tree and validate each harness's packaging. |
| Release identity | `VERSION`, `CHANGES.md`, `tools/provenance.json` | AStack uses its own semver and records the upstream version and commit separately. |

The bootstrap retains the port reference's declared policy forks as well as its mechanical compatibility work. Those are visible in `tools/forks.json`; they are not represented as original PStack behavior. Review them individually before changing them rather than silently discarding mature workflows.

AStack uses the `astack:` plugin namespace and `astack-models.md` configuration. The upstream `poteto-mode` and `setup-pstack` skill names are retained to minimize path churn. Thus Claude invokes `/astack:poteto-mode` and `/astack:setup-pstack`.

The Codex adapter uses available tools and model capabilities rather than assuming that every Codex surface exposes the same tool names. The Apple policy takes precedence over generic app-driving examples for Apple work. User and project instructions take precedence over all plugin guidance.

New functionality should be placed in the smallest applicable layer. A new Apple requirement usually needs a change to the Apple reference, not copies of every workflow. When fixing a portability defect, add a behavioral fixture to the existing tests and make the translation reproducible.
