# Runtime release contract

The automatic publisher requires an operator-owned executable on the validation runner. Its arguments are the candidate plugin directory and a writable evidence directory outside the checkout. Exit zero only after both harnesses pass; create logs and a result summary under the evidence directory. Do not replace this with manifest-only validation.

Use disposable harness profiles and fixture repositories. Keep the checker and credentials outside the candidate. Do not test on live projects or use shipping/signing credentials.

1. Load the exact candidate in Claude Code and Codex using their native plugin mechanisms. Assert AStack identity, all expected skills, and no duplicate loose-skill registration. Record harness versions and the tested candidate commit.
2. Invoke poteto-mode and a direct skill. Prove each resolves sibling references. Exercise a simple fixture change and verify its behavioral test, rather than accepting a model's completion claim.
3. Exercise one delegated workflow where supported. Assert tool and model dispatch validity. In a restricted profile, assert a truthful sequential fallback and no fabricated independent review.
4. Run each SessionStart hook with routing enabled and disabled. Verify separate astack-models.md configuration and that PStack configuration is untouched.
5. For an Apple fixture, verify that the workflow selects XcodeBuildMCP, discovers real scheme/destination information, and reports missing capabilities rather than inventing results. For a UI fixture, require light/dark captures and UI-tree evidence from the actual app.
6. Install an older AStack fixture, update to the candidate, reload, and assert the new version is active. Roll back to the older fixture and assert its version is active again.

The fixture suite and runner installation are not yet implemented in this bootstrap. Native manifest validation, generator tests, and shell-hook tests are available now. Until the runtime checker is commissioned, keep ASTACK_AUTOPUBLISH unset and review prepared candidates manually.
