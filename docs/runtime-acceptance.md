# Native runtime release checks

Run the committed release smoke test after installing the candidate in both harnesses:

```sh
bun tools/runtime-smoke.mjs "$(~/.agents/bin/agent-task-dir)/review-artifacts/runtime"
```

The test requires authenticated Claude Code and Codex CLIs. It preserves raw responses and a result summary outside the repository, and fails unless:

- Claude's native session inventory contains this AStack version, every public command, and every declared agent.
- Claude successfully invokes the installed `astack:bro` skill without a permission failure.
- Codex successfully reads this version's installed `bro` skill from its native plugin cache and completes the requested rewrite.

It disables the old pstack plugin only in the Claude test process so its hook cannot compete with AStack. It does not change the user's persistent settings. Both model calls are read-only smoke requests with no delegation or workflow expansion.

This is native registration and execution evidence, not an exhaustive proof of all workflows. Repository tests separately cover reference reachability, hook enable/disable behavior, model mapping generation, sync conflict handling, and script behavior.

For changes to particular workflows, add focused behavioral evidence. Apple UI guidance changes should be exercised on an Apple fixture using XcodeBuildMCP; delegation changes need a dispatch check; installation lifecycle changes need update/reload/rollback checks. A release report must distinguish completed checks from untested surfaces.

The optional GitHub self-hosted runtime job accepts an operator-owned executable taking a plugin directory and an evidence directory. That executable must install and test the candidate before returning success; it must not replace the smoke check with manifest-only validation. The primary local update automation can perform those steps using the installed harnesses on this Mac.
