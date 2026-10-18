# AStack

AStack workflows for Claude Code and Codex.

AStack starts from the working Claude/Codex adaptation in [pstack-claude](https://github.com/michael-denyer/pstack-claude), then maintains its own adaptations directly against [Lauren Tan's original PStack](https://github.com/cursor/plugins/tree/main/pstack). The port is an attributed bootstrap, not an ongoing dependency. Exact source revisions are recorded in [upstream pins](tools/upstream.json) and [provenance](tools/provenance.json).

## Install

Replace `OWNER/REPOSITORY` below with the GitHub repository that distributes your AStack copy. For a private repository, authenticate Git with an account that has access. The marketplace and plugin are both named `astack`, regardless of the repository owner.

### Claude Code

Run in Claude Code:

```text
/plugin marketplace add OWNER/REPOSITORY
/plugin install astack@astack
```

For development from a local checkout, use `claude --plugin-dir "$PWD/plugins/astack"`.

Use `/astack:poteto-mode` for the main workflow and `/astack:setup-astack` for model and routing configuration. AStack uses its own plugin namespace, setup command, and model configuration.

### Codex

Run in a terminal:

```sh
codex plugin marketplace add OWNER/REPOSITORY
codex plugin add astack@astack
```

Restart or reload the host as its installation flow requires, review its hook trust prompt, and request the installed `poteto-mode` skill. AStack shares the same skills tree across both harnesses. Do not also install loose copies of these skills or enable PStack's competing routing hook in the same project.

Packaging follows the [OpenAI plugin documentation](https://developers.openai.com/plugins/build/plugins) and [Claude plugin documentation](https://code.claude.com/docs/en/plugins). The repeatable [native smoke test](docs/runtime-acceptance.md) verifies command and agent registration plus installed skill execution in both harnesses. It does not claim exhaustive workflow validation.

## Develop and update

```sh
bun tools/generate.mjs
bash tools/check.sh
```

To check original PStack without modifying the checkout:

```sh
export ASTACK_ARTIFACTS_DIR="$(mktemp -d)"
bun tools/update-upstream.mjs --check --report-dir "$ASTACK_ARTIFACTS_DIR/upstream"
```

Installing the plugin does not create a scheduler. Use the [portable maintenance setup](docs/maintenance.md) and [committed scheduler prompt](docs/maintenance-prompt.md) on your chosen host. The [workflow diagrams](docs/workflow.md) explain source ownership, updates, and daily use. Before making an existing fork public, follow the [publication privacy checklist](docs/publication.md).

See [the update and automatic release workflow](docs/upstream.md), [adaptation ownership](docs/adaptations.md), and [the skill catalog](docs/reference.md).

## Data handling

AStack adds no server or telemetry. Agent-visible source and transcripts are processed by the selected harness and model provider. Bundled scripts execute locally; PR workflows use the user's GitHub credentials. A workflow does not grant permission to publish or send messages.

## License

MIT. Original PStack is by Lauren Tan; portability work is by Michael Denyer; imported cursor-team-kit material is by Cursor. Copyright and license notices are retained in [LICENSE](LICENSE), [LICENSE-cursor-team-kit](LICENSE-cursor-team-kit), and [NOTICE.md](NOTICE.md).
