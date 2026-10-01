# How AStack fits together

AStack is the plugin used in a development project. A separately configured scheduled agent maintains the plugin repository.

## Source ownership

```mermaid
flowchart TD
    C["pstack-claude<br/>Working Claude/Codex adaptation"]
    P["Original PStack<br/>cursor/plugins/pstack"]
    A["AStack<br/>Claude Code and Codex adaptations"]
    CC["Claude Code"]
    CX["Codex"]
    C -. "One-time starting code" .-> A
    P -->|"Future upstream changes"| A
    A -->|"Install plugin"| CC
    A -->|"Install plugin"| CX
```

The bootstrap revision is recorded in `tools/provenance.json`. Future releases follow original PStack directly, using immutable revisions in `tools/upstream.json`. AStack maintains its own translation rules and declared differences. It does not depend on future pstack-claude releases.

## Scheduled maintenance

```mermaid
flowchart TD
    T["Configured schedule<br/>on a commissioned host"] --> C["Check original PStack"]
    C --> D{"Anything changed?"}
    D -->|"No"| Q["Finish quietly"]
    D -->|"Yes"| A["Inspect changes<br/>Prepare an isolated update"]
    A --> R["Apply translation rules<br/>Preserve declared customizations"]
    R --> V["Run project checks<br/>Test exact candidate in Claude and Codex"]
    V --> G{"Checks passed and<br/>publication authorized?"}
    G -->|"Yes"| P["Commit, tag, publish<br/>Verify release and installation"]
    P --> N["Notify the operator"]
    G -->|"No"| S["Keep evidence<br/>Report blocker or prepared candidate"]
```

The schedule invokes an agent, which reads the [committed runbook](maintenance.md). It must stop when a change is ambiguous or a required check fails. Its host must have both authenticated runtimes available to validate a release. A check-only schedule needs fewer capabilities.

The optional GitHub pipeline separates preparation, runtime validation, and publication into jobs with different permissions. It is an alternative publisher. Only one publisher should be enabled for a repository.

## Everyday development

```mermaid
flowchart LR
    Y["Request work<br/>in a development repository"] --> H["Claude Code or Codex"]
    H --> A["AStack selects a workflow"]
    A --> W["Investigate, design,<br/>implement and verify"]
    W --> E["Code changes<br/>and verification evidence"]
```

In Claude Code, request `/astack:poteto-mode` followed by the task. In Codex, ask to use AStack's `poteto-mode` skill. You can also request a focused skill such as `architect`, `interrogate`, or `bro`.

Plugin use does not require running the maintenance schedule. Publishing a release does not update an existing agent session. Refresh the installed plugin and reload the session using the host's supported installation flow.
