# Ace Patches — Fork Maintenance Guide

This directory contains the patch definitions and build-time patch script that
re-apply fork-specific changes after syncing with upstream `ajaxorg/ace-builds`.

## How it works

Instead of editing built files directly (which causes merge conflicts every
upstream update), this fork uses a **build-time patch script** that modifies
the built files automatically. The workflow:

1. Sync with upstream (accept their changes)
2. Run `node scripts/apply-patches.js` — this applies all patches to the built files
3. Commit the patched files

Consumers of this fork install it as a **drop-in replacement** for upstream
ace-builds — no runtime config or setup changes needed.

## Structure

```
scripts/
  apply-patches.js   — Build-time script that patches all 4 build directories
  sync-upstream.sh   — Full sync workflow: fetch + merge + patch
patches/
  themes/
    theme-streamlit_light.js   — Custom Streamlit light theme
    theme-streamlit_dark.js    — Custom Streamlit dark theme
  ace-patches.js     — Runtime monkey-patches (fallback/alternate approach)
  ace-patches.mjs    — ES module version of runtime patches
  PATCHES.md         — This file
```

## Updating from upstream

### Quick method (recommended)

```bash
npm run sync-upstream
# or
bash scripts/sync-upstream.sh
```

This will:
- Fetch upstream changes
- Merge with `upstream/master` (using `-X theirs` to auto-resolve built file conflicts)
- Run `apply-patches.js` to re-apply all patches
- Show instructions to commit the result

### Manual method

```bash
git fetch upstream
git merge upstream/master -X theirs
node scripts/apply-patches.js
git add -A && git commit -m "Sync upstream + apply patches"
```

### Just re-apply patches (no sync)

```bash
npm run apply-patches
# or
node scripts/apply-patches.js
```

## Patch Catalog

| # | Patch | What it does | Target file(s) |
|---|-------|--------------|-----------------|
| 1 | HI_DPI disable | Disables `ace_hidpi` CSS class (causes scroll issues in embedded contexts) | `ace.js` |
| 2 | BackgroundTokenizer null-safety | Prevents crash when `this.doc` is null/undefined in `start()` | `ace.js` |
| 3 | Snippet removal fix | Uses `findIndex` by name instead of `indexOf` by reference for reliable snippet removal | `ext-language_tools.js` |
| 4 | addLineAfter keybinding | Changes keybinding from `Ctrl-Enter`/`Command-Enter` to `Shift-Enter` | `keybinding-vscode.js` |
| 5 | Theme switch cleanup | Removes opposite Streamlit theme CSS element when switching themes | `ace.js` |
| 6 | Streamlit theme files | Copies `theme-streamlit_light.js` and `theme-streamlit_dark.js` into build dirs | all 4 build dirs |
| 7 | Themelist extension | Adds Streamlit Dark/Light entries to `ext-themelist.js` | `ext-themelist.js` |
| 8 | Embed Streamlit themes | Embeds theme definitions directly in `ace.js` for eager loading (uses `define()` in `src/`, `ace.define()` in `src-noconflict/`) | `ace.js` (src, src-noconflict) |
| 9 | Custom One Dark theme | Copies custom `theme-one_dark.js` (darker bg, Google Fonts, custom fold icons) into build dirs | all 4 build dirs |
| 10 | Type definition fix | Adds `| string` to `mode` parameter in `createEditSession()` and `EditSession` constructor | `ace.d.ts` |
| 11 | Module declarations | Adds `declare module` entries for `theme-streamlit_dark` and `theme-streamlit_light` | `ace-modules.d.ts` |
| 12 | Webpack resolver fix | Adds Streamlit theme URLs and fixes `keyboard_menu` → `keybinding_menu` typo (still broken upstream) | `webpack-resolver.js` |
| 13 | Keybord typo fix | Fixes `getEditorKeybordShortcuts` → `getEditorKeyboardShortcuts` (upstream still has typo) | `ext-keybinding_menu.js` |

All patches are applied across all 4 build directories: `src/`, `src-noconflict/`, `src-min/`, `src-min-noconflict/` (where applicable — patches 10–12 target root-level files).

### Changes NOT migrated (already fixed upstream or cosmetic only)

| Change | Reason skipped |
|--------|----------------|
| `getEditorKeybordShortcuts` typo fix | Fixed in upstream since v1.23.0 |
| Module path fixes (`"./ext/error_marker"` → `"ace/ext/error_marker"`) | Fixed in upstream |
| Formatting-only changes (searchbox CSS, prompt whitespace) | No behavioral impact |
| `ext-prompt.js` `getEditorKeyboardShortcuts` module | Module removed from ext-prompt.js in newer upstream; only exists in ext-keybinding_menu.js now |
| `ext-inline_autocomplete.js` | Upstream addition — didn't exist in fork's parent commit |
| `esm-resolver.js` | Content matches upstream (verified via hash) |

## Adding a new patch

1. Write the patch function in `scripts/apply-patches.js` — both readable and minified variants
2. Make sure it's idempotent (detects when already applied)
3. Test: reset files to upstream, run the script, verify it applies cleanly
4. Run twice to verify idempotency

## Fallback: Runtime patches

If you need to apply patches at runtime (e.g., you can't modify the built files),
you can use the runtime monkey-patch modules:

```js
import ace from "ace-builds";
import { applyAllPatches } from "ace-builds/patches/ace-patches.mjs";
applyAllPatches(ace);
```

See `patches/ace-patches.js` / `.mjs` for available functions.
