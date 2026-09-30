# AStack

PStack workflows for Claude Code and Codex, with Apple software development guidance.

AStack starts from the working Claude/Codex adaptation in [pstack-claude](https://github.com/michael-denyer/pstack-claude), then maintains its own adaptations directly against [Lauren Tan's original PStack](https://github.com/cursor/plugins/tree/main/pstack). The port is an attributed bootstrap, not an ongoing dependency. Exact source revisions are recorded in [upstream pins](tools/upstream.json) and [provenance](tools/provenance.json).

## Install

AStack is distributed from the private [aataraxiaa/astack repository](https://github.com/aataraxiaa/astack). Authenticate Git with a GitHub account that has access before installing.

### Claude Code

Run in Claude Code:

```text
/plugin marketplace add aataraxiaa/astack
/plugin install astack@astack
```

For development from a local checkout, use `claude --plugin-dir "$PWD/plugins/astack"`.

Use `/astack:poteto-mode` for the main workflow and `/astack:setup-pstack` for model and routing configuration. Skill names retain their upstream names; the plugin namespace and configuration belong to AStack.

### Codex

Run in a terminal:

```sh
codex plugin marketplace add aataraxiaa/astack
codex plugin add astack@astack
```

Restart or reload the host as its installation flow requires, review its hook trust prompt, and request the installed `poteto-mode` skill. AStack shares the same skills tree across both harnesses. Do not also install loose copies of these skills or enable PStack's competing routing hook in the same project.

Packaging follows the [OpenAI plugin documentation](https://developers.openai.com/plugins/build/plugins) and [Claude plugin documentation](https://code.claude.com/docs/en/plugins). Local structural validation does not prove native loading, reload behavior, or model-driven workflows; see [runtime acceptance](docs/runtime-acceptance.md).

## Apple development

The main workflow loads [Apple development guidance](plugins/astack/skills/poteto-mode/references/apple-development.md) for Swift and Apple platform work. It uses the project's conventions and design system, XcodeBuildMCP for Xcode and simulator work, relevant behavioral tests, and light/dark UI evidence. Missing runtime validation must be reported explicitly.

## Develop and update

```sh
bun tools/generate.mjs
bash tools/check.sh
```

To check original PStack without modifying the checkout:

```sh
bun tools/update-upstream.mjs --check --report-dir "$(~/.agents/bin/agent-task-dir)/review-artifacts/upstream"
```

See [the update and automatic release workflow](docs/upstream.md), [adaptation ownership](docs/adaptations.md), and [the skill catalog](docs/reference.md).

## Data handling

AStack adds no server or telemetry. Agent-visible source and transcripts are processed by the selected harness and model provider. Bundled scripts execute locally; PR workflows use the user's GitHub credentials. A workflow does not grant permission to publish or send messages.

## License

MIT. Original PStack is by Lauren Tan; portability work is by Michael Denyer; imported cursor-team-kit material is by Cursor. Copyright and license notices are retained in [LICENSE](LICENSE), [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit), and [NOTICE.md](NOTICE.md).
