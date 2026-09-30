# Apple development

Use this guidance for Swift, SwiftUI, UIKit, AppKit, Xcode projects, and Apple platform behavior. Keep the repository's architecture, deployment targets, and design system authoritative.

- Trace the caller and lifecycle before changing state, navigation, ownership, or concurrency. Reuse the project's established isolation and observation patterns. Do not introduce an actor, wrapper, or dependency without a demonstrated need.
- Read adjacent code and the project's build instructions first. Use its schemes, test plans, generation steps, and package runner. Discover identifiers; do not guess scheme names, simulator IDs, assets, or MCP tool names.
- Use XcodeBuildMCP for Xcode build, run, test, logs, screenshots, and UI tree work. If unavailable, report the missing capability and the exact validation left undone. Do not silently substitute direct xcodebuild, xcrun, or simctl commands. For standalone Swift packages, use the project's existing checks.
- For UI changes, run the affected flow, inspect light and dark appearances and the UI tree, and compare with the supplied design or established product flow. Check relevant accessibility labels, Dynamic Type, keyboard or VoiceOver behavior, and localization using the project's supported surfaces.
- Use existing design-system colors, typography, spacing, and verified assets. Preserve platform conventions and user state across presentation and dismissal.
- For logic changes, run relevant tests and leave a small behavioral regression check for non-trivial logic. A lint pass or successful build does not establish runtime correctness.
- State the tested scheme, destination, flow, and result. Separate simulator evidence from device evidence and both from static inspection. Signing, distribution, TestFlight, and App Store submission require authorization for that action.

Store transient evidence in the project's agent-neutral artifact directory when provided. Keep screenshots, logs, and handoff notes out of the repository unless they are intentional maintained fixtures.
