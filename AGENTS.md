# AStack maintenance

AStack follows original PStack in `https://github.com/cursor/plugins` directly. `tools/upstream.json` pins original sources. `tools/provenance.json` records the one-time portability reference; it is not an update dependency.

- Read `docs/upstream.md` before changing the adaptation or release workflow.
- Mechanical harness adaptations belong in `tools/substitutions.json`, with a reason. Deliberate changes to upstream-owned files belong in `tools/forks.json`. Native AStack files must be documented in `docs/adaptations.md`.
- Keep the public plugin under `plugins/astack`. Shared skills belong to this distributable package; do not install a second loose copy into personal skill directories while developing it.
- Preserve licenses and attribution. Never rewrite an upstream source identity into an AStack URL.
- Run `bun tools/generate.mjs`, then `bun test tests/`. Script changes also require the package's frozen install, typecheck, and tests, as described in CONTRIBUTING.md.
- Do not publish from unresolved merges or claim native runtime validation from structural checks. Automatic publishing requires the release environment and its runtime checks.
- Follow `docs/maintenance.md` for scheduled updates. Keep host settings and evidence outside Git. Set `ASTACK_ARTIFACTS_DIR` to an external directory and save handoff state in its `resume.md`. A host artifact-directory helper is optional, never a repository dependency.
