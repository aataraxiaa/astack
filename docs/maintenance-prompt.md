# Scheduled maintenance prompt

Use the text below as the scheduled task prompt after completing [host setup](maintenance.md#commission-a-host). Set the checkout, interval, and location of the external host settings in the scheduler, not in this repository. If the scheduler has no separate settings field, append that local information to its saved prompt.

```text
Maintain AStack in the project checkout attached to this task. Read AGENTS.md,
docs/maintenance.md, docs/upstream.md, and the external host settings supplied
when this task was commissioned. Follow the committed maintenance procedure.
Original cursor/plugins/pstack is the only PStack update source. pstack-claude
is an attributed bootstrap, never an update dependency.

Check upstream and save reports outside Git. Preserve unrelated work. If
upstream is unchanged, finish quietly. Prepare changed candidates in an isolated
clean checkout. Respect the configured check, prepare, or publish mode. If host
settings or authorization are missing, check only and report what is needed.
This prompt does not grant publication permission.

Before publishing, inspect the diff, run project checks, and verify the exact
candidate through Claude Code and Codex native plugin mechanisms, including
tools/runtime-smoke.mjs. An old installed version is not candidate proof.
Preserve host configuration and restore its original marketplace sources.
Publish only to the explicitly authorized repository after all gates pass and
the base remains current. Never force-push, move existing tags, expose
credentials, change visibility, or broaden access.

Stop and notify on ambiguous policy changes, unresolved conflicts, missing
capabilities, or failed validation. Save a resumable checkpoint outside Git.
Notify only for a new release, a newly prepared candidate in prepare mode, a
failure, or required operator action. Do not repeat an unchanged blocker on
every run.
```
