#!/usr/bin/env node
/**
 * apply-patches.js — Apply all custom patches to Ace built files.
 *
 * Run this after syncing with upstream to re-apply fork-specific changes.
 * Usage: node scripts/apply-patches.js
 *
 * This patches files in all four build directories:
 *   src/, src-noconflict/, src-min/, src-min-noconflict/
 */

var fs = require("fs");
var path = require("path");

var ROOT = path.resolve(__dirname, "..");
var PATCHES_DIR = path.join(ROOT, "patches");

var results = { applied: 0, skipped: 0, failed: 0, details: [] };

function log(status, msg) {
    var icon = status === "ok" ? "\x1b[32m✓\x1b[0m" : status === "skip" ? "\x1b[33m⊘\x1b[0m" : "\x1b[31m✗\x1b[0m";
    console.log("  " + icon + " " + msg);
    results.details.push({ status: status, msg: msg });
    if (status === "ok") results.applied++;
    else if (status === "skip") results.skipped++;
    else results.failed++;
}

function readFile(filepath) {
    try { return fs.readFileSync(filepath, "utf8"); } catch (e) { return null; }
}

function writeFile(filepath, content) {
    fs.writeFileSync(filepath, content, "utf8");
}

function replaceInFile(filepath, search, replacement, label) {
    var content = readFile(filepath);
    if (!content) { log("skip", label + " — file not found: " + filepath); return false; }
    if (content.indexOf(replacement) !== -1) { log("skip", label + " — already applied"); return true; }
    if (content.indexOf(search) === -1) { log("fail", label + " — search pattern not found in " + path.basename(filepath)); return false; }
    content = content.replace(search, replacement);
    writeFile(filepath, content);
    log("ok", label);
    return true;
}

function insertAfterInFile(filepath, anchor, insertion, label) {
    var content = readFile(filepath);
    if (!content) { log("skip", label + " — file not found: " + filepath); return false; }
    if (content.indexOf(insertion) !== -1) { log("skip", label + " — already applied"); return true; }
    var idx = content.indexOf(anchor);
    if (idx === -1) { log("fail", label + " — anchor not found in " + path.basename(filepath)); return false; }
    content = content.slice(0, idx + anchor.length) + insertion + content.slice(idx + anchor.length);
    writeFile(filepath, content);
    log("ok", label);
    return true;
}

function copyFileIfMissing(src, dest, label) {
    if (fs.existsSync(dest)) { log("skip", label + " — already exists"); return true; }
    var content = readFile(src);
    if (!content) { log("fail", label + " — source not found: " + src); return false; }
    writeFile(dest, content);
    log("ok", label);
    return true;
}

// =====================================================================
// PATCH 1: Disable HI_DPI CSS class (scroll issues)
// =====================================================================
function patchHiDpi() {
    console.log("\n[Patch 1] Disable HI_DPI CSS class");
    // Non-minified: src/ and src-noconflict/
    ["src", "src-noconflict"].forEach(function (dir) {
        replaceInFile(
            path.join(ROOT, dir, "ace.js"),
            "        if (dom.HI_DPI)\n            dom.addCssClass(this.container, \"ace_hidpi\");",
            "        // [PATCH] Disabled: HI_DPI causes scroll issues in embedded contexts\n        // if (dom.HI_DPI)\n        //     dom.addCssClass(this.container, \"ace_hidpi\");",
            dir + "/ace.js — HI_DPI"
        );
    });
    // Minified: src-min/ and src-min-noconflict/
    ["src-min", "src-min-noconflict"].forEach(function (dir) {
        replaceInFile(
            path.join(ROOT, dir, "ace.js"),
            'i.HI_DPI&&i.addCssClass(this.container,"ace_hidpi")',
            '!1&&i.addCssClass(this.container,"ace_hidpi")',
            dir + "/ace.js — HI_DPI (minified)"
        );
    });
}

// =====================================================================
// PATCH 2: BackgroundTokenizer null-safety
// =====================================================================
function patchBackgroundTokenizer() {
    console.log("\n[Patch 2] BackgroundTokenizer null-safety");
    ["src", "src-noconflict"].forEach(function (dir) {
        replaceInFile(
            path.join(ROOT, dir, "ace.js"),
            "        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());",
            "        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc ? (isNaN(this.doc.getLength()) ? Infinity : this.doc.getLength()) : Infinity);",
            dir + "/ace.js — BackgroundTokenizer null-safety"
        );
    });
    // Minified variant
    ["src-min", "src-min-noconflict"].forEach(function (dir) {
        var filepath = path.join(ROOT, dir, "ace.js");
        var content = readFile(filepath);
        if (!content) { log("skip", dir + "/ace.js — BackgroundTokenizer (minified) — file not found"); return; }
        // Match pattern like: this.currentLine=Math.min(e||0,this.currentLine,this.doc.getLength())
        var re = /this\.currentLine=Math\.min\((\w)\|\|0,this\.currentLine,this\.doc\.getLength\(\)\)/;
        var match = content.match(re);
        if (!match) {
            if (content.indexOf("this.doc?(isNaN(this.doc.getLength())?Infinity:this.doc.getLength()):Infinity") !== -1) {
                log("skip", dir + "/ace.js — BackgroundTokenizer (minified) — already applied");
            } else {
                log("fail", dir + "/ace.js — BackgroundTokenizer (minified) — pattern not found");
            }
            return;
        }
        var varName = match[1];
        content = content.replace(
            match[0],
            "this.currentLine=Math.min(" + varName + "||0,this.currentLine,this.doc?(isNaN(this.doc.getLength())?Infinity:this.doc.getLength()):Infinity)"
        );
        writeFile(filepath, content);
        log("ok", dir + "/ace.js — BackgroundTokenizer (minified)");
    });
}

// =====================================================================
// PATCH 3: Snippet removal — use findIndex by name instead of indexOf
// =====================================================================
function patchSnippetRemoval() {
    console.log("\n[Patch 3] Snippet removal fix (findIndex by name)");
    ["src", "src-noconflict"].forEach(function (dir) {
        replaceInFile(
            path.join(ROOT, dir, "ext-language_tools.js"),
            "                var i = map && map.indexOf(s);\n                if (i >= 0)\n                    map.splice(i, 1);",
            "                var i = map && map.findIndex(function(snip) { return snip.name === s.name; });\n                if (i >= 0)\n                    map.splice(i, 1);",
            dir + "/ext-language_tools.js — snippet removal"
        );
    });
    ["src-min", "src-min-noconflict"].forEach(function (dir) {
        var filepath = path.join(ROOT, dir, "ext-language_tools.js");
        var content = readFile(filepath);
        if (!content) { log("skip", dir + "/ext-language_tools.js — snippet removal (minified) — file not found"); return; }
        if (content.indexOf("findIndex") !== -1 && content.indexOf("snip.name") !== -1) {
            log("skip", dir + "/ext-language_tools.js — snippet removal (minified) — already applied"); return;
        }
        // Pattern: varA&&varA.indexOf(varB);varC>=0&&varA.splice(varC,1) inside unregister
        var re = /(\w+)&&\1\.indexOf\((\w+)\);(\w+)>=0&&\1\.splice\(\3,1\)/;
        var match = content.match(re);
        if (!match) { log("fail", dir + "/ext-language_tools.js — snippet removal (minified) — pattern not found"); return; }
        var mapVar = match[1], sVar = match[2], iVar = match[3];
        content = content.replace(
            match[0],
            mapVar + "&&(" + iVar + "=" + mapVar + ".findIndex(function(snip){return snip.name===" + sVar + ".name}));" + iVar + ">=0&&" + mapVar + ".splice(" + iVar + ",1)"
        );
        writeFile(filepath, content);
        log("ok", dir + "/ext-language_tools.js — snippet removal (minified)");
    });
}

// =====================================================================
// PATCH 4: Keybinding — addLineAfter: Ctrl-Enter → Shift-Enter
// =====================================================================
function patchKeybinding() {
    console.log("\n[Patch 4] Keybinding: addLineAfter → Shift-Enter");
    ["src", "src-noconflict"].forEach(function (dir) {
        replaceInFile(
            path.join(ROOT, dir, "keybinding-vscode.js"),
            '        bindKey: { mac: "Command-Enter", win: "Ctrl-Enter" },\n        name: "addLineAfter"',
            '        bindKey: { mac: "Shift-Enter", win: "Shift-Enter" },\n        name: "addLineAfter"',
            dir + "/keybinding-vscode.js — addLineAfter"
        );
    });
    ["src-min", "src-min-noconflict"].forEach(function (dir) {
        replaceInFile(
            path.join(ROOT, dir, "keybinding-vscode.js"),
            'bindKey:{mac:"Command-Enter",win:"Ctrl-Enter"},name:"addLineAfter"',
            'bindKey:{mac:"Shift-Enter",win:"Shift-Enter"},name:"addLineAfter"',
            dir + "/keybinding-vscode.js — addLineAfter (minified)"
        );
    });
}

// =====================================================================
// PATCH 5: Streamlit theme switch cleanup
// =====================================================================
function patchThemeSwitch() {
    console.log("\n[Patch 5] Streamlit theme switch cleanup");
    var insertion =
        '\n            // [PATCH] Clean up opposite Streamlit theme CSS on switch\n' +
        '            if (module.cssClass == "ace-streamlit-light")\n' +
        '                dom.removeElementById("ace-streamlit-dark");\n' +
        '            else if (module.cssClass == "ace-streamlit-dark")\n' +
        '                dom.removeElementById("ace-streamlit-light");\n';

    ["src", "src-noconflict"].forEach(function (dir) {
        insertAfterInFile(
            path.join(ROOT, dir, "ace.js"),
            '            dom.importCssString(module.cssText, module.cssClass, _self.container);',
            insertion,
            dir + "/ace.js — theme switch cleanup"
        );
    });
    // Minified
    var minInsertion = ',"ace-streamlit-light"==t.cssClass?i.removeElementById("ace-streamlit-dark"):"ace-streamlit-dark"==t.cssClass&&i.removeElementById("ace-streamlit-light")';
    ["src-min", "src-min-noconflict"].forEach(function (dir) {
        var filepath = path.join(ROOT, dir, "ace.js");
        var content = readFile(filepath);
        if (!content) { log("skip", dir + "/ace.js — theme switch (minified) — file not found"); return; }
        if (content.indexOf("ace-streamlit-light") !== -1) {
            log("skip", dir + "/ace.js — theme switch (minified) — already applied");
            return;
        }
        // Find the minified importCssString call in setTheme context
        var anchor = /i\.importCssString\(\w+\.cssText,\w+\.cssClass,\w+\.container\)/;
        var match = content.match(anchor);
        if (!match) {
            log("fail", dir + "/ace.js — theme switch (minified) — pattern not found");
            return;
        }
        var idx = content.indexOf(match[0]);
        content = content.slice(0, idx + match[0].length) + minInsertion + content.slice(idx + match[0].length);
        writeFile(filepath, content);
        log("ok", dir + "/ace.js — theme switch (minified)");
    });
}

// =====================================================================
// PATCH 6: Streamlit themes — copy standalone theme files
// =====================================================================
function patchStreamlitThemes() {
    console.log("\n[Patch 6] Streamlit theme files");
    var themesDir = path.join(PATCHES_DIR, "themes");
    ["src", "src-noconflict", "src-min", "src-min-noconflict"].forEach(function (dir) {
        copyFileIfMissing(
            path.join(themesDir, "theme-streamlit_light.js"),
            path.join(ROOT, dir, "theme-streamlit_light.js"),
            dir + "/theme-streamlit_light.js"
        );
        copyFileIfMissing(
            path.join(themesDir, "theme-streamlit_dark.js"),
            path.join(ROOT, dir, "theme-streamlit_dark.js"),
            dir + "/theme-streamlit_dark.js"
        );
    });
}

// =====================================================================
// PATCH 7: Add Streamlit Dark to themelist
// =====================================================================
function patchThemeList() {
    console.log("\n[Patch 7] Add Streamlit themes to themelist");
    ["src", "src-noconflict"].forEach(function (dir) {
        insertAfterInFile(
            path.join(ROOT, dir, "ext-themelist.js"),
            '    ["One Dark", "one_dark", "dark"],',
            '\n    ["Streamlit Dark", "streamlit_dark", "dark"],\n    ["Streamlit Light", "streamlit_light", "light"],',
            dir + "/ext-themelist.js — add Streamlit themes"
        );
    });
    ["src-min", "src-min-noconflict"].forEach(function (dir) {
        replaceInFile(
            path.join(ROOT, dir, "ext-themelist.js"),
            '["One Dark","one_dark","dark"]',
            '["One Dark","one_dark","dark"],["Streamlit Dark","streamlit_dark","dark"],["Streamlit Light","streamlit_light","light"]',
            dir + "/ext-themelist.js — add Streamlit themes (minified)"
        );
    });
}

// =====================================================================
// PATCH 8: Embed Streamlit themes in ace.js for eager loading
//          (themes defined inline so they're available immediately)
// =====================================================================
function patchEmbedStreamlitThemes() {
    console.log("\n[Patch 8] Embed Streamlit themes in ace.js");

    var lightThemeFile = path.join(PATCHES_DIR, "themes", "theme-streamlit_light.js");
    var darkThemeFile = path.join(PATCHES_DIR, "themes", "theme-streamlit_dark.js");
    var lightContent = readFile(lightThemeFile);
    var darkContent = readFile(darkThemeFile);

    if (!lightContent || !darkContent) {
        log("fail", "Theme source files not found in patches/themes/");
        return;
    }

    // Extract just the ace.define blocks (strip the self-registering wrapper)
    function extractDefines(content) {
        // Get everything up to but not including the IIFE wrapper
        var parts = content.split(/\}\);\s*\(function\s*\(\)/);
        return parts[0] + "});\n";
    }

    var lightDefs = extractDefines(lightContent);
    var darkDefs = extractDefines(darkContent);

    // Inject removeElementById calls into embedded defines (cross-theme cleanup at load time)
    lightDefs = lightDefs.replace(
        '    dom.importCssString(exports.cssText, exports.cssClass, false);\n',
        '    dom.importCssString(exports.cssText, exports.cssClass, false);\n    dom.removeElementById("ace-streamlit-dark");\n'
    );
    darkDefs = darkDefs.replace(
        '    dom.importCssString(exports.cssText, exports.cssClass, false);\n',
        '    dom.importCssString(exports.cssText, exports.cssClass, false);\n    dom.removeElementById("ace-streamlit-light");\n'
    );

    var block =
        "\n// [PATCH] Streamlit themes — loaded eagerly for Streamlit compatibility\n" +
        lightDefs + "\n" + darkDefs + "\n";

    // Insert before the config define block
    ["src", "src-noconflict"].forEach(function (dir) {
        var filepath = path.join(ROOT, dir, "ace.js");
        var content = readFile(filepath);
        if (!content) { log("skip", dir + "/ace.js — embed themes — file not found"); return; }
        if (content.indexOf("ace/theme/streamlit_light") !== -1) {
            log("skip", dir + "/ace.js — embed Streamlit themes — already applied");
            return;
        }
        // src-noconflict uses ace.define, src uses define
        var anchor = content.indexOf('ace.define("ace/config",');
        if (anchor === -1) anchor = content.indexOf('define("ace/config",');
        if (anchor === -1) { log("fail", dir + "/ace.js — embed themes — config anchor not found"); return; }
        // src/ uses define() not ace.define() — convert if needed
        var dirBlock = block;
        if (dir === "src") {
            dirBlock = dirBlock.replace(/^ace\.define\(/gm, "define(");
        }
        content = content.slice(0, anchor) + dirBlock + content.slice(anchor);
        writeFile(filepath, content);
        log("ok", dir + "/ace.js — embed Streamlit themes");
    });
}

// =====================================================================
// PATCH 9: Custom One Dark theme (darker bg, Google Fonts, fold icons)
// =====================================================================
function patchOneDark() {
    console.log("\n[Patch 9] Custom One Dark theme");
    var srcFile = path.join(PATCHES_DIR, "themes", "theme-one_dark.js");
    var customContent = readFile(srcFile);
    if (!customContent) { log("fail", "Custom one_dark source not found in patches/themes/"); return; }
    ["src", "src-noconflict", "src-min", "src-min-noconflict"].forEach(function (dir) {
        var dest = path.join(ROOT, dir, "theme-one_dark.js");
        var existing = readFile(dest);
        if (!existing) { log("skip", dir + "/theme-one_dark.js — file not found"); return; }
        if (existing === customContent) { log("skip", dir + "/theme-one_dark.js — already applied"); return; }
        // Check if this is the upstream version (has original bg color)
        if (existing.indexOf("#282c34") !== -1 || existing.indexOf("background-color:#282c34") !== -1) {
            writeFile(dest, customContent);
            log("ok", dir + "/theme-one_dark.js — replaced with custom version");
        } else if (existing.indexOf("#1a1c24") !== -1) {
            // Has the custom bg color but content doesn't match exactly — replace anyway
            writeFile(dest, customContent);
            log("ok", dir + "/theme-one_dark.js — updated custom version");
        } else {
            log("fail", dir + "/theme-one_dark.js — unexpected content, skipping");
        }
    });
}

// =====================================================================
// PATCH 10: ace.d.ts — allow string mode parameter
// =====================================================================
function patchAceDts() {
    console.log("\n[Patch 10] ace.d.ts — mode type accepts string");
    var filepath = path.join(ROOT, "ace.d.ts");
    var content = readFile(filepath);
    if (!content) { log("skip", "ace.d.ts — file not found"); return; }
    if (content.indexOf("createEditSession") === -1) { log("skip", "ace.d.ts — createEditSession not found"); return; }
    // Find the createEditSession line and add | string to the mode parameter
    var lines = content.split("\n");
    var changed = false;
    for (var i = 0; i < lines.length; i++) {
        if (lines[i].indexOf("createEditSession") !== -1 && lines[i].indexOf("mode") !== -1) {
            if (lines[i].indexOf("string") !== -1 && lines[i].indexOf("mode") !== -1) {
                // Check if string is already part of the mode type (not just the text parameter)
                // The line has both 'text: ... | string' and 'mode?: ...'
                // We need to check specifically after 'mode'
                var modeIdx = lines[i].indexOf("mode");
                var afterMode = lines[i].slice(modeIdx);
                if (afterMode.indexOf("string") !== -1) {
                    log("skip", "ace.d.ts — mode: string already present");
                    return;
                }
            }
            // Add | string before the closing paren of mode type
            // Find the ): after mode parameter
            var modeStart = lines[i].indexOf("mode");
            var rest = lines[i].slice(modeStart);
            // Find the closing ): which ends the parameter list
            var closeParen = rest.lastIndexOf("):");
            if (closeParen !== -1) {
                lines[i] = lines[i].slice(0, modeStart + closeParen) + " | string" + lines[i].slice(modeStart + closeParen);
                changed = true;
            }
            break;
        }
    }
    if (changed) {
        writeFile(filepath, lines.join("\n"));
        log("ok", "ace.d.ts — createEditSession mode accepts string");
    } else {
        log("skip", "ace.d.ts — could not modify createEditSession signature");
    }
}

// =====================================================================
// PATCH 11: ace-modules.d.ts — Streamlit theme module declarations
// =====================================================================
function patchAceModulesDts() {
    console.log("\n[Patch 11] ace-modules.d.ts — Streamlit theme declarations");
    var filepath = path.join(ROOT, "ace-modules.d.ts");
    var content = readFile(filepath);
    if (!content) { log("skip", "ace-modules.d.ts — file not found"); return; }
    if (content.indexOf("theme-streamlit_dark") !== -1) { log("skip", "ace-modules.d.ts — already applied"); return; }
    var anchor = "declare module 'ace-builds/src-noconflict/theme-sqlserver';";
    if (content.indexOf(anchor) === -1) {
        // Try alternate anchor
        anchor = "declare module 'ace-builds/src-noconflict/theme-solarized_light';";
    }
    if (content.indexOf(anchor) === -1) { log("fail", "ace-modules.d.ts — anchor not found"); return; }
    var insertion = "\ndeclare module 'ace-builds/src-noconflict/theme-streamlit_dark';\ndeclare module 'ace-builds/src-noconflict/theme-streamlit_light';";
    var idx = content.indexOf(anchor);
    content = content.slice(0, idx + anchor.length) + insertion + content.slice(idx + anchor.length);
    writeFile(filepath, content);
    log("ok", "ace-modules.d.ts — added Streamlit theme declarations");
}

// =====================================================================
// PATCH 12: webpack-resolver.js — Streamlit theme URLs + keybinding fix
// =====================================================================
function patchWebpackResolver() {
    console.log("\n[Patch 12] webpack-resolver.js — Streamlit themes + keybinding fix");
    var filepath = path.join(ROOT, "webpack-resolver.js");
    var content = readFile(filepath);
    if (!content) { log("skip", "webpack-resolver.js — file not found"); return; }

    // Fix keyboard_menu → keybinding_menu (upstream bug still present)
    if (content.indexOf("'ace/ext/keyboard_menu'") !== -1) {
        content = content.replace("'ace/ext/keyboard_menu'", "'ace/ext/keybinding_menu'");
        writeFile(filepath, content);
        log("ok", "webpack-resolver.js — keyboard_menu → keybinding_menu");
    } else if (content.indexOf("'ace/ext/keybinding_menu'") !== -1) {
        log("skip", "webpack-resolver.js — keybinding_menu already correct");
    } else {
        log("skip", "webpack-resolver.js — keyboard_menu entry not found");
    }

    // Add streamlit theme URLs
    content = readFile(filepath); // re-read after possible edit above
    if (content.indexOf("theme/streamlit_dark") !== -1) {
        log("skip", "webpack-resolver.js — Streamlit themes already present");
        return;
    }
    var anchor = "ace.config.setModuleUrl('ace/theme/sqlserver'";
    if (content.indexOf(anchor) === -1) {
        anchor = "ace.config.setModuleUrl('ace/theme/solarized_light'";
    }
    if (content.indexOf(anchor) === -1) { log("fail", "webpack-resolver.js — theme anchor not found"); return; }
    // Find end of the anchor line
    var idx = content.indexOf(anchor);
    var lineEnd = content.indexOf("\n", idx);
    if (lineEnd === -1) lineEnd = content.length;
    var insertion = "\nace.config.setModuleUrl('ace/theme/streamlit_dark', require('file-loader?esModule=false!./src-noconflict/theme-streamlit_dark.js'));\nace.config.setModuleUrl('ace/theme/streamlit_light', require('file-loader?esModule=false!./src-noconflict/theme-streamlit_light.js'));";
    content = content.slice(0, lineEnd) + insertion + content.slice(lineEnd);
    writeFile(filepath, content);
    log("ok", "webpack-resolver.js — added Streamlit theme URLs");
}

// =====================================================================
// PATCH 13: Fix getEditorKeybordShortcuts typo (upstream still has it)
// =====================================================================
function patchKeybordTypo() {
    console.log("\n[Patch 13] Fix getEditorKeybordShortcuts typo");
    ["src", "src-noconflict", "src-min", "src-min-noconflict"].forEach(function (dir) {
        var filepath = path.join(ROOT, dir, "ext-keybinding_menu.js");
        var content = readFile(filepath);
        if (!content) { log("skip", dir + "/ext-keybinding_menu.js — file not found"); return; }
        if (content.indexOf("getEditorKeybordShortcuts") === -1) {
            log("skip", dir + "/ext-keybinding_menu.js — typo already fixed");
            return;
        }
        content = content.split("getEditorKeybordShortcuts").join("getEditorKeyboardShortcuts");
        writeFile(filepath, content);
        log("ok", dir + "/ext-keybinding_menu.js — Keybord → Keyboard");
    });
}

// =====================================================================
// Run all patches
// =====================================================================
console.log("Applying ace-builds patches...");
console.log("Root: " + ROOT);

patchHiDpi();
patchBackgroundTokenizer();
patchSnippetRemoval();
patchKeybinding();
patchThemeSwitch();
patchStreamlitThemes();
patchThemeList();
patchEmbedStreamlitThemes();
patchOneDark();
patchAceDts();
patchAceModulesDts();
patchWebpackResolver();
patchKeybordTypo();

console.log("\n" + "=".repeat(50));
console.log("Results: " + results.applied + " applied, " + results.skipped + " skipped, " + results.failed + " failed");

if (results.failed > 0) {
    console.log("\x1b[31mSome patches failed! Check output above.\x1b[0m");
    process.exit(1);
}
