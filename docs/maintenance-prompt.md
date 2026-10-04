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

Review every changed path in original PStack, including new, renamed, and removed
skills, command catalogs, documentation, references, scripts, agents, hooks,
metadata, dependencies, and licensing. Record whether each change is imported,
adapted, already covered, or intentionally excluded, with a reason. Excluded
Cursor files still need review for behavior or documentation AStack must carry.

Complete routine adaptations yourself. Reconcile public skills with the command
catalog, update counts and references, and regenerate shortcuts and packaging.
Repair mechanical conflicts and validation failures when the intended behavior
is clear under existing AStack policy, then rerun the affected checks. Never
weaken a check just to pass. Resume saved partial candidates before the
unchanged-upstream exit; do not reapply or bump versions blindly. A missing
catalog row or generated file is work to complete, not an operator blocker.

Before publishing, inspect the diff, run project checks, and verify the exact
candidate through Claude Code and Codex native plugin mechanisms, including
tools/runtime-smoke.mjs. An old installed version is not candidate proof.
Preserve host configuration and restore its original marketplace sources.
Publish only to the explicitly authorized repository after all gates pass and
the base remains current. Never force-push, move existing tags, expose
credentials, change visibility, or broaden access.

Stop and notify on ambiguous policy changes, conflicts that cannot be resolved
under existing policy, missing required capabilities, or validation still failing
after focused repair attempts. Record what you tried and what remains unresolved. Save a resumable checkpoint outside Git.
Notify only for a new release, a newly prepared candidate in prepare mode, a
failure, or required operator action. Do not repeat an unchanged blocker on
every run.
```
