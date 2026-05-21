#!/usr/bin/env bash
set -euo pipefail

# Find the correct gh binary. /usr/bin/gh is a broken npm package.
# /home/tdobson/.local/bin/gh is the real GitHub CLI.
if command -v /home/tdobson/.local/bin/gh &>/dev/null; then
  GH=/home/tdobson/.local/bin/gh
elif command -v gh &>/dev/null; then
  # Verify it's the real CLI, not the npm package
  if gh --version 2>&1 | grep -qi 'node_modules/gh'; then
    echo "Wrong gh on PATH (npm package). Use /home/tdobson/.local/bin/gh or fix PATH ordering." >&2
    exit 5
  fi
  GH=gh
else
  echo "GitHub CLI (gh) not found. Install it or check PATH." >&2
  exit 5
fi

BRANCH="${1:-$(git symbolic-ref --short HEAD)}"

echo "Finding latest deploy for branch $BRANCH ..." >&2

RUN_JSON=$("$GH" run list --repo Mavala-UK/mavala --branch "$BRANCH" --limit 1 --json databaseId,status,conclusion 2>&1)

RUN_ID=$(echo "$RUN_JSON" | jq -r '.[0].databaseId // empty')
STATUS=$(echo "$RUN_JSON" | jq -r '.[0].status // empty')
CONCLUSION=$(echo "$RUN_JSON" | jq -r '.[0].conclusion // empty')

if [ -z "$RUN_ID" ]; then
  echo "No deploy runs found for branch $BRANCH. Push the branch first." >&2
  exit 1
fi

echo "Found run $RUN_ID (status: $STATUS, conclusion: ${CONCLUSION:-pending})" >&2

if [ "$STATUS" != "completed" ]; then
  echo "Deploy still running for $BRANCH (run $RUN_ID, status: $STATUS)" >&2
  exit 2
fi

if [ "$CONCLUSION" != "success" ]; then
  echo "Deploy failed for $BRANCH (run $RUN_ID, conclusion: $CONCLUSION)" >&2
  exit 3
fi

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

if ! "$GH" run download "$RUN_ID" --repo Mavala-UK/mavala --name h2-deploy-log -D "$TMPDIR" 2>/dev/null; then
  echo "Artifact not found. Deploys before 2026-05-21 don't have h2-deploy-log (needs chunk #53). Re-push the branch." >&2
  exit 4
fi

jq -r '.url' "$TMPDIR/h2_deploy_log.json"
