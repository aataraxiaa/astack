# Original PStack to AStack

## Source chain

AStack starts with the pstack-claude source revision recorded in `tools/provenance.json`. That imports a working translation layer and its tests once. From then on, the only update source is `https://github.com/cursor/plugins`, with `pstack` pinned to a full commit in `tools/upstream.json`. The additional cursor-team-kit component is pinned independently and is not silently advanced with PStack.

Do not merge future pstack-claude releases into AStack. Relevant fixes may be reviewed and ported individually with attribution, like any other reference implementation.

## Detect and adapt

The original publisher currently versions PStack in `pstack/.cursor-plugin/plugin.json`, without GitHub releases. `tools/update-upstream.mjs` asks GitHub for the latest commit touching `pstack`, then reads the manifest at that exact commit. It catches a version bump and a same-version correction. It never treats a moving branch name as the source pin.

```sh
report_dir="${ASTACK_ARTIFACTS_DIR:?Set an external artifacts directory}/upstream"
bun tools/update-upstream.mjs --check --report-dir "$report_dir"
```

The report contains old/new versions, immutable commits, and the upstream comparison URL. To prepare an update on a clean working branch:

```sh
bun tools/update-upstream.mjs --apply --report-dir "$report_dir"
bash tools/check.sh
```

The updater uses the inherited three-way sync implementation, with AStack's substitution rules and fork registry. It runs in fail-on-conflict mode: overlapping edits, modified files deleted upstream, symlinks, unknown Cursor constructs, and undeclared forks stop the update. New skills without a catalog row also stop generation. Review those changes, adapt the rules or declared fork, add a regression fixture, and retry. The updater does not use an LLM to silently guess its way through a conflict.

A failure after a successful sync can leave a partial candidate in the working branch. Inspect that diff; the release pipeline publishes only after all gates succeed. Preserve or discard that candidate explicitly before retrying because apply requires a clean tree. For manual conflict resolution, the lower-level `bun tools/sync.mjs pstack <full-sha>` can produce conflict markers; the generator rejects unresolved markers.

## Portable scheduled maintenance

Use [maintenance setup](maintenance.md) to commission a scheduled agent on a host with authenticated Claude Code, Codex, and GitHub access. The [scheduler prompt](maintenance-prompt.md) points the agent at the same committed runbook on every run. Scheduling, credentials, checkout paths, and publication authorization are host settings outside this repository.

A six-hour interval is a suggested starting point. Run one publisher per repository. The plugin itself neither installs nor enables a scheduler. See [the diagrams](workflow.md) for the source chain and release gates.

## Optional GitHub-hosted publication pipeline

`.github/workflows/upstream.yml` polls every six hours and supports a manual run. It has three jobs:

1. **Prepare.** Read original upstream, adapt on an isolated checkout, run generation, repository tests, bundled script typecheck and tests. Build a candidate Git bundle and preserve the sync report. This job has no repository write permission.
2. **Runtime.** On a dedicated ephemeral macOS runner, verify the candidate checksum and commit, then run an operator-owned acceptance executable against the exact candidate. Both Claude Code and Codex must pass. The executable is outside the downloaded candidate so upstream cannot redefine the release gate.
3. **Publish.** In a separate environment with repository write permission, verify the same bundle and commit. Refuse if main advanced. Fast-forward main and create the version tag atomically, then create the GitHub release with the plugin archive. It does not execute candidate scripts with the write token.

Configure these repository variables only after testing the pipeline:

| Variable | Meaning |
| --- | --- |
| `ASTACK_UPSTREAM_AUTOMATION=true` | Enable scheduled preparation. Manual preparation remains available without it. |
| `ASTACK_AUTOPUBLISH=true` | Enable runtime validation and publication after successful preparation. |
| `ASTACK_RUNTIME_CHECK` | Absolute path to the trusted acceptance executable on the validation runner. |

Register an ephemeral runner with `self-hosted`, `macOS`, and `astack-validation` labels. Its checker takes the plugin directory and an external evidence directory as arguments and exits nonzero unless the [runtime contract](runtime-acceptance.md) passes. The workflow archives evidence and rejects a missing evidence directory. Provide only the credentials needed for those tests, no production signing or distribution credentials.

Create the `astack-release` environment. For unattended releases, give the release bot the narrowly required branch permission and leave that environment without mandatory human approval after commissioning. If repository rules require a PR or prohibit the bot's fast-forward, publication stops; do not add a force-push or broad bypass. In that environment, use reviewed updates and release after merge instead.

The GitHub publication path is opt-in. Inspect repository variables to determine its current state. Enable only one publisher. To move publication into GitHub, first commission its runner and checker, then disable the previous publisher.

## Failures and recovery

- Preparation failure leaves reports on the failed Actions run. The last published AStack remains available. Correct the adaptation and rerun; do not ship on a clean text merge alone.
- A runtime failure blocks publication and retains evidence. Changes to permission-sensitive workflows or release machinery warrant review even if text merged cleanly.
- Concurrent main changes block publication. Run preparation again against the new main.
- If the push succeeded but GitHub release creation failed, rerun the failed publish job from that run. It accepts the already-published candidate commit and tag only when they match exactly, then creates the missing release. It never moves an existing tag.
- Roll back installed clients to a previous release. To undo behavior on main, revert the affected change in a new commit and ship a new AStack version; do not rewrite a published tag.

Keep failed release runs visible in GitHub notifications. The pipeline does not post messages or open PRs automatically. After deployment, verify that each harness refreshes its installed cache and recognizes the new AStack version; a GitHub release alone does not establish client uptake.
