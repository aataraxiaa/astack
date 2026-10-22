# Select a verification driver

Use this policy whenever an AStack workflow needs to drive an app or maintain its verification skill. Selection uses the active runtime's available skills and project instructions. It needs no resolver, configuration file, app-local shim, or symlink.

1. Honor a driver explicitly selected by the user or project instructions, including an installed plugin skill. Read that skill before driving. If the selected driver is missing or unavailable, report the missing capability and stop dependent verification. Do not substitute another driver or generate a copy.
2. Otherwise, inspect project-local verification skills for the touched package and surface. Also inspect available installed plugin skills whose descriptions identify the product and surface. A name such as `verify` alone does not establish applicability.
3. Use the appropriate project-local driver when its scope is clear. If none applies, use the single applicable installed plugin driver automatically. If multiple candidates remain applicable and their scopes do not select one, ask which driver to use before driving.
4. If no driver applies, use `/create-verification-skill` when a maintained driver is needed. Otherwise use the runtime's available app-driving fallback. Claude Code's `run` can drive supported apps and commands. Its bundled `verify` requires a user invocation. On Codex, follow the [platform mapping](codex-tools.md). Report missing tools and unobserved behavior precisely.

An installed driver runs against the caller's active product checkout. Confirm the checkout and requested surface before launch. Follow the driver's feature map and evidence instructions. Installation and a source read establish discovery only; runtime proof requires driving the real app.

## Keep ownership explicit

A project-local driver lives in the product repository. An external driver lives in a separate editable plugin source repository and reaches the runtime through native plugin installation. Its feature map and owned helpers stay beside the skill in that source repository. Reference product-owned flows in the active checkout rather than duplicating them.

Installed plugin caches are runtime inputs, never maintenance destinations. For external creation or maintenance, identify the editable source directory separately from both the active product checkout and installed cache. Use native plugin installation or update mechanisms to deliver source changes. Do not copy or link a second driver into the product repository.
