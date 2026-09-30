# Contributing to AStack

## The sync boundary

Read [adaptation ownership](docs/adaptations.md) and [the upstream workflow](docs/upstream.md). Original PStack owns the baseline workflows. AStack owns translations and declared policy differences, including Apple guidance. The port reference is a one-time source import.

Use `tools/substitutions.json` for reproducible rewrites. Declare deliberate upstream-file changes in `tools/forks.json`, with a concrete reason. The sync tool derives old and new original source through the same transformations, then performs a three-way merge. It rejects undeclared divergence, unsupported Cursor constructs, and binary conflicts. Automatic mode also refuses all text, symlink, and deletion conflicts without writing.

## Checks

```sh
bun tools/generate.mjs
bash tools/check.sh
```

The generator owns versions, model sections, native agent lists, Codex prompt stubs, and portable license copies. Edit its source inputs, not generated sections. It validates skill frontmatter, links, namespace references, hooks, and marketplace paths. Repository tests exercise generation, sync conflicts, scripts, and hook configuration.

The check script also installs bundled dependencies with the frozen lockfile, typechecks them, and runs their tests. When changing bundled script formatting, use the inherited Prettier settings:

```sh
cd plugins/astack/skills/poteto-mode/scripts
bunx prettier@3.6.2 --check .
```

When Claude Code is available:

```sh
claude plugin validate plugins/astack --strict
claude plugin validate . --strict
```

Validate workflow changes with actionlint. Inspect workflow permissions and publication gates before enabling automation. Static checks and shell-hook tests are not native runtime acceptance. Follow [runtime acceptance](docs/runtime-acceptance.md) before release.

## Releasing

AStack has its own semver in `VERSION`. Add a matching `## <version> - <title>` entry to `CHANGES.md`, regenerate, and pass the checks. Keep the upstream version and immutable commit separate in provenance and pins. Automatic upstream updates increment AStack's patch version; AStack-only changes may bump its version independently.

Local update automation uses the authenticated harnesses on the maintainer’s Mac. The optional GitHub publisher requires an ephemeral validation runner, trusted runtime checker, and release environment. No release should claim that tests ran if only manifests were validated. Publishing details and recovery procedures are in [the upstream workflow](docs/upstream.md).
