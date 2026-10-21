---
name: poteto-help
description: Guides users through AStack setup, /poteto-mode, and picking the skill, playbook, or principle for a task. Type /poteto-help with a question.
---

# Poteto help

Answer the user's question about AStack, hand them a prompt they can send, and link the file the answer came from. For a help question, don't start the work. The user asked how, and an AStack run spends real tokens, so let them send the prompt.

A message that asks for work, such as "use AStack to fix this bug", is not a help question. Read [`poteto-mode`](../poteto-mode/SKILL.md), do the work under it, and respect the current runtime’s session-hook setting.

This file maps questions to installed skills and references. Read the target file before answering. Its instructions own the details. Link the installed AStack file you read. Original [PStack sources](https://github.com/cursor/plugins/tree/main/pstack) are attribution and background, not instructions for AStack's adapted runtime behavior. Do not invent a public AStack repository URL.

On Claude Code, public commands use `/astack:<name>`. On Codex, request a skill by name; `/name` forms require the optional installed shortcuts. The examples below use short names for readability.

## Find out what they need

Infer the need from the message and the conversation. A named situation, such as "which skill reviews a PR?", goes straight to its section. If the need is still unclear, ask one multiple-choice question with these options, then answer only the section they pick:

- Get set up
- Start a task with `/poteto-mode`
- Pick a skill for a situation
- Fix a run that went wrong
- Make AStack my own

Check the state that changes the answer, and mention it only when it does:

- Read the current runtime’s override sheet at the path in [`setup-astack`](../setup-astack/SKILL.md). A missing sheet means role defaults apply; do not infer whether setup was previously run.
- Apply [verification driver selection](../poteto-mode/references/verification-drivers.md) before recommending a new driver. An applicable installed plugin driver can supply verification without a project-local skill. Mention `/create-verification-skill` when no driver applies and the question is about proving a change works.

When the override sheet is missing and it matters, ask whether the user wants to pick a model for each role and a reasoning effort now. It matters when the user is new, the question is about setup or cost, or the answer depends on which models run. Ask at most once per chat. If the need is also unclear, ask both questions together. Offer two choices:

- Now: give them `/setup-astack` to type, and answer their question too.
- Later: answer their question, and add one line saying every role keeps its default model until they run `/setup-astack`.

## Get set up

1. Use the active runtime's native plugin marketplace to install AStack from the repository supplied by the operator. Inspect the configured marketplace and native command help before suggesting an installation command; do not guess its owner or URL.
2. Run [`/setup-astack`](../setup-astack/SKILL.md) to select available per-role models, reasoning effort, and whether the session hook routes tasks. It documents configuration paths and loading for each runtime.
3. Start a task with `/poteto-mode`, a goal, and a check that can pass or fail. Offer to word it using [`references/prompting.md`](references/prompting.md).

AStack supports Claude Code and Codex through its native packaging and [platform mapping](../poteto-mode/references/codex-tools.md). Its enabled SessionStart hook injects routing instructions; Codex requires hook trust. `/setup-astack` can turn this hook off. Turning it off affects fresh sessions; it does not erase instructions already in the current context.

Subagents and review panels use extra tokens. The override sheet selects models and effort; panel length controls the number of seats. `auto` and `inherit-parent` reuse the parent model, which is not necessarily cheaper. Recommend choices only from models the runtime actually exposes.

## Start a task with `/poteto-mode`

`/poteto-mode` matches the task to a playbook, copies the playbook's steps into the todo list, and runs the other skills as the steps need them. A step it skips stays in the list as `skip: <reason>`. A good prompt states the goal and how to tell it's done. It doesn't list skills, because a hand-written sequence tends to drop or reorder steps the playbook would keep. Read [`references/prompting.md`](references/prompting.md) before you help word one.

For persistent routing, check the SessionStart hook and override sheet described in [`setup-astack`](../setup-astack/SKILL.md). With the hook disabled or unavailable, invoke `/poteto-mode` for each new task. Do not promise Cursor Custom Mode keyboard shortcuts in Claude Code or Codex. A new task requires choosing a fresh playbook.

For subagent dispatch, follow [`poteto-mode`](../poteto-mode/SKILL.md) and the active runtime mapping. They specify the wrapper, model overrides, and isolation requirements.

## Pick a skill

The default answer is `/poteto-mode`, which runs most of the others when its steps need them. Name a skill directly when the user wants more or less of something than the playbook gives. Read the skill before you recommend it, and give one example prompt.

| The user wants to | Skill |
|---|---|
| Do any non-trivial task with rigor | [`/poteto-mode`](../poteto-mode/SKILL.md) |
| Know how code works now, or where new code should live | [`/how`](../how/SKILL.md) |
| Know why code is shaped this way, or where a number came from | [`/why`](../why/SKILL.md) |
| Understand a change or subsystem, explained plainly | [`/teach`](../teach/SKILL.md) |
| Catch up on their own recent work on a topic | [`/recall`](../recall/SKILL.md) |
| Know what a small diff could break outside itself | [`/blast-radius`](../blast-radius/SKILL.md) |
| Settle types and module shape before code that crosses a function boundary | [`/architect`](../architect/SKILL.md) |
| Get several attempts at one brief, merged into the best one | [`/arena`](../arena/SKILL.md) |
| Run parallel checks over slices, or race workers | [`/swarm`](../swarm/SKILL.md) |
| Have different models review a diff and try to break it | [`/interrogate`](../interrogate/SKILL.md) |
| Fix a bug test-first when a cheap local test exists | [`/tdd`](../tdd/SKILL.md) |
| Apply TypeScript rules to `.ts` or `.tsx` work | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| Strip comments before review, using a reviewer that didn't write them | [`/no-comments`](../no-comments/SKILL.md) |
| Clean AI tells out of prose | [`/unslop`](../unslop/SKILL.md) |
| Write docs, an RFC, a README, a PR description, or a commit message to a standard | [`/technical-writing`](../technical-writing/SKILL.md) |
| Hear the last reply again in plain words | [`/bro`](../bro/SKILL.md) |
| Give agents a scripted way to drive the app and prove behavior | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| Bring a verification skill and its feature map back in line with the app | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| Vet a performance number before reporting or acting on it | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| Run a large or cross-cutting change, or one to review after stepping away | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| Keep a decision log during a run, and review it afterward | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| Pick a model for each role and a reasoning effort | [`/setup-astack`](../setup-astack/SKILL.md) |
| Turn their own working habits into a personal mode skill | [`/automate-me`](../automate-me/SKILL.md) |
| Turn what a finished task taught into skill edits | [`/reflect`](../reflect/SKILL.md) |
| Stop agents from repeating the same mistakes in this repo | [`/correct`](../correct/SKILL.md) |
| Find their way around AStack | `/poteto-help` |

If a skill directory next to this one is missing from the table, read its frontmatter and route by its description. The `principle-*` directories are covered under principles below.

Close calls:

- `/how` explains what the code does. `/why` explains the reasons. `/teach` runs one or both and explains the result plainly.
- `/arena` gives every worker the same brief and merges the best parts. `/swarm` splits work into slices or a race and returns one report.
- `/architect` implements right after it settles the design. Add "with checkpoint" to review the design before it writes code.
- `/interrogate` reviews the diff. `/blast-radius` looks for breakage outside the diff and proves the one fact that makes the change safe.
- `/recall` rebuilds context across recent chats. Resuming one specific chat or branch is the Session pickup playbook.
- `/figure-it-out` designs one rigorous run. The Orchestrate playbook runs a program that spans days and many PRs. The Autonomous run playbook drives one task to a finish condition.

Runtime capabilities:

- AStack bundles [`/deslop`](../deslop/SKILL.md). For app drivers, read poteto-mode's Non-negotiables and its Codex mapping; inspect available tools.
- Scheduling depends on the host. Use an available Claude Code scheduler or Codex scheduled task only with the user's authorization. A local sleep does not establish a durable schedule.
- Orchestrate is a poteto-mode playbook, not a bundled slash command.
- Skill authoring uses the active runtime's available authoring guidance.

## Playbooks and principles

Playbooks are step lists inside `/poteto-mode`, not skills, so they have no slash command. Inside `/poteto-mode`, describing the task picks one, and these phrases name one directly:

- "babysit this pr" or "check on pr 123" runs Babysit. It drives the PR to merge-ready and stops there. It doesn't merge unless the user asks to merge, land, or ship.
- "land the stack" runs Shipping.
- "take over this branch" runs Session pickup.
- "pause safely" runs Pause safely.
- "full autopilot on this queue" runs Autopilot-full. "stack them, don't ship" runs Autopilot-stack.
- "run the eval playbook" runs Eval.

The Playbooks section of [`poteto-mode`](../poteto-mode/SKILL.md) lists every playbook and its trigger. AStack also bundles a standalone [`babysit`](../babysit/SKILL.md) skill.

Use the active runtime's planning capability when available. For work that spans phases or stacked PRs, asking `/poteto-mode` for a plan runs the [Multi-phase plan playbook](../poteto-mode/playbooks/multi-phase-plan.md), which writes the plan and doesn't implement it. For a design question, the Prototype playbook or `/architect` settles it in code first.

Principles are one-rule skills that `/poteto-mode` reads and cites in its replies. The user rarely invokes one. They steer with the names instead, as in "apply prove it works. show me the real output." Principles are references, not public slash commands; ask for the principle by name.

## Fix a run that went wrong

| Symptom | Fix |
|---|---|
| The mode stopped applying after a few turns | Check the session-hook setting and start a fresh session, or invoke `/poteto-mode` for this task. |
| A question got treated as the next step of the last task | Say "new task", or say the turn doesn't need the mode. |
| A new model choice had no effect | Check that the override sheet is loaded as described in setup-astack, then start a fresh session. |
| Runs cost more than expected | See the cost paragraph under Get set up. |
| A skill didn't load on its own | Invoke the skill explicitly and check native plugin discovery. The session hook routes qualifying tasks, not every skill on every turn. |
| Parallel agents overwrote each other | Give each writer its own worktree. Check the actual dispatch environment; do not assume a separate machine. |
| An overnight run moved but finished nothing | Define a pass/fail finish condition and use a supported scheduler. Establish app verification before running unattended. |
| The reply claims success from a green build | Ask for the real command, flow, stored value, or profile. That's the prove-it-works principle. |

For a run that drifts, [`references/prompting.md`](references/prompting.md) has one-line steers. See [`references/recipes.md`](references/recipes.md) for examples.

## Make AStack my own

- [`/automate-me`](../automate-me/SKILL.md) drafts a personal mode skill from the user's own history, to use alongside `/poteto-mode`.
- [`/reflect`](../reflect/SKILL.md) after a session turns its lessons into skill edits the user approves.
- `/poteto-mode write a skill for <workflow>` runs the authoring playbook. The eval playbook tests a skill change blind.
- Fix a misbehaving skill in its own PR, not inside the feature work where it went wrong.

Repeated mistakes should become structural checks through [`correct`](../correct/SKILL.md). Verification-skill maintenance is useful, but recommending it does not authorize a new schedule.

## Reply

Lead with the answer. Give at most one example prompt in a code block, adapted from [`references/recipes.md`](references/recipes.md) when one fits, then the link to that file. Keep it short unless the user asked for the whole map.
