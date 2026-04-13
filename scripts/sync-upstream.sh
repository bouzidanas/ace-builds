#!/usr/bin/env bash
#
# sync-upstream.sh — Sync this fork with upstream ace-builds and re-apply patches.
#
# Usage:
#   ./scripts/sync-upstream.sh              # merge upstream/master
#   ./scripts/sync-upstream.sh --reset      # hard-reset to upstream/master (discards fork)
#   ./scripts/sync-upstream.sh --patches    # just re-apply patches (skip sync)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT"

MODE="${1:-merge}"

# -------------------------------------------------------
# Step 0: Ensure upstream remote exists
# -------------------------------------------------------
if ! git remote get-url upstream &>/dev/null; then
    echo "Adding upstream remote..."
    git remote add upstream https://github.com/ajaxorg/ace-builds.git
fi

# -------------------------------------------------------
# Step 1: Sync with upstream (unless --patches only)
# -------------------------------------------------------
if [[ "$MODE" != "--patches" ]]; then
    echo "Fetching upstream..."
    git fetch upstream

    if [[ "$MODE" == "--reset" ]]; then
        echo "Resetting to upstream/master..."
        echo "WARNING: This discards ALL local changes. Press Ctrl+C to cancel."
        read -r -p "Continue? [y/N] " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            echo "Aborted."
            exit 0
        fi
        git reset --hard upstream/master
    else
        echo "Merging upstream/master..."
        # Use -X theirs to auto-resolve conflicts in built files —
        # our patches will be re-applied by the script.
        git merge upstream/master -X theirs -m "Merge upstream ace-builds" || {
            echo ""
            echo "Merge conflict. Options:"
            echo "  1) Resolve manually, then run: node scripts/apply-patches.js"
            echo "  2) Accept upstream entirely:  git checkout --theirs . && git add ."
            echo "     then run: node scripts/apply-patches.js"
            exit 1
        }
    fi
fi

# -------------------------------------------------------
# Step 2: Apply patches
# -------------------------------------------------------
echo ""
echo "Applying patches..."
node "$SCRIPT_DIR/apply-patches.js"

# -------------------------------------------------------
# Step 3: Stage and remind to commit
# -------------------------------------------------------
echo ""
CHANGED=$(git diff --name-only)
STAGED=$(git diff --cached --name-only)

if [[ -n "$CHANGED" ]]; then
    echo "Patched files have been modified. Stage and commit with:"
    echo "  git add -A && git commit -m 'Apply fork patches after upstream sync'"
else
    echo "No additional changes to commit (patches may have already been applied)."
fi
