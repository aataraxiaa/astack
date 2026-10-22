#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
bun tools/generate.mjs --check
bun test tests/
(
  cd plugins/astack/skills/auto/scripts
  bun install --frozen-lockfile
  bun run typecheck
  bun test orch watch-pr
)
