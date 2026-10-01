# Prepare a repository for public distribution

Cleaning the current files does not clean Git history, tags, release archives, Actions logs, or repository settings. This checklist applies before changing visibility or copying a private fork to a public destination.

1. Inspect the tracked tree for credentials, personal contact details, host paths, local transcripts, and machine-specific instructions. Keep real upstream copyright notices and source attribution. Generic examples and test fixtures are not operator settings.
2. Inspect author and committer metadata with `git log --all --format=fuller`, and inspect old file versions across branches and tags. Use a public-safe commit identity for new work. Do not assume `.gitignore` removes previously committed data.
3. Review existing release notes, downloadable archives, and CI artifacts separately. Git history cleanup does not remove an old release asset or a retained log. If a credential was exposed, revoke it before deciding how to remove the data.
4. Choose a publication strategy. A new repository initialized from a reviewed clean export avoids carrying private history forward. Preserve licenses and attribution in that export. Rewriting the existing repository requires an explicit owner decision, coordinated clone replacement, and separate handling of tags and release assets. Do not force-push or change visibility automatically.
5. Review the destination's security reporting contact and permissions. Set up its own scheduler and credentials from [maintenance setup](maintenance.md). Keep publication disabled until the host passes the native acceptance gates.
6. Verify the public candidate from a fresh clone, including manifests, install commands, asset contents, source pins, and native installation. Recheck that the clone contains no local host settings or evidence.

A source scan is evidence about the patterns and revisions inspected, not a guarantee that all personal information or secrets have been found.
