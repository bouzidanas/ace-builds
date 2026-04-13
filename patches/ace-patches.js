/**
 * Runtime monkey-patches for Ace editor (applied after Ace loads).
 *
 * These patches were previously applied as direct edits to built/minified
 * Ace files. They are now maintained separately so the ace-builds dependency
 * can be updated to upstream without merge conflicts.
 *
 * Usage (call once after Ace is loaded):
 *   import { applyAllPatches } from "./patches/ace-patches";
 *   applyAllPatches(ace);
 *
 * Or selectively:
 *   import { patchHiDpi, patchSnippetRemoval, ... } from "./patches/ace-patches";
 */

// ---------------------------------------------------------------------------
// 1. Disable HI_DPI CSS class
//    The ace_hidpi class causes scroll issues in certain embedded contexts.
//    Original: VirtualRenderer constructor adds ace_hidpi when dom.HI_DPI is true.
// ---------------------------------------------------------------------------
function patchHiDpi(ace) {
    var dom = ace.require("ace/lib/dom");
    if (dom) {
        dom.HI_DPI = false;
    }
}

// ---------------------------------------------------------------------------
// 2. BackgroundTokenizer null-safety
//    Prevents crash when this.doc is null/undefined during start().
//    Original: this.doc.getLength() would throw if doc is null.
// ---------------------------------------------------------------------------
function patchBackgroundTokenizer(ace) {
    var BackgroundTokenizer = ace.require("ace/background_tokenizer");
    if (!BackgroundTokenizer) return;

    var BT = BackgroundTokenizer.BackgroundTokenizer;
    if (!BT) return;

    var origStart = BT.prototype.start;
    BT.prototype.start = function (startRow) {
        if (!this.doc || typeof this.doc.getLength !== "function") {
            // doc is not available yet, skip
            return;
        }
        var len = this.doc.getLength();
        if (isNaN(len)) len = Infinity;
        this.currentLine = Math.min(startRow || 0, this.currentLine, len);
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);
        this.stop();
        this.running = setTimeout(this.$worker, 700);
    };
}

// ---------------------------------------------------------------------------
// 3. Snippet removal fix (ext-language_tools)
//    Uses name comparison instead of reference equality for snippet removal.
//    Original: map.indexOf(s) fails because the snippet object in the map
//    may be a different reference than the one being removed.
// ---------------------------------------------------------------------------
function patchSnippetRemoval(ace) {
    var snippetModule = ace.require("ace/snippets");
    if (!snippetModule) return;

    var SnippetManager = snippetModule.snippetManager;
    if (!SnippetManager) return;

    var origUnregister = SnippetManager.unregister;
    SnippetManager.unregister = function (snippets, scope) {
        var snippetMap = this.snippetMap;
        var snippetNameMap = this.snippetNameMap;

        function removeSnippet(s) {
            var nameMap = snippetNameMap[s.scope || scope];
            if (nameMap && nameMap[s.name]) {
                delete nameMap[s.name];
                var map = snippetMap[s.scope || scope];
                var i = map && map.findIndex(function (snip) {
                    return snip.name === s.name;
                });
                if (i >= 0) {
                    map.splice(i, 1);
                }
            }
        }

        if (snippets && snippets.content) {
            removeSnippet(snippets);
        } else if (Array.isArray(snippets)) {
            snippets.forEach(removeSnippet);
        }
    };
}

// ---------------------------------------------------------------------------
// 4. Keybinding: addLineAfter → Shift-Enter (instead of Ctrl-Enter)
//    Changed for Streamlit compatibility where Ctrl-Enter is used to submit.
// ---------------------------------------------------------------------------
function patchVscodeKeybinding(ace) {
    var config = ace.require("ace/config");
    if (!config) return;

    config.loadModule("ace/ext/keybinding_menu", function () {
        // Keybinding is loaded on demand; we patch the vscode handler if present
    });

    var HashHandler = ace.require("ace/keyboard/hash_handler");
    if (!HashHandler) return;

    // The vscode keybinding may be loaded later; monkey-patch setKeyboardHandler
    // to intercept when it's applied.
    var Editor = ace.require("ace/editor").Editor;
    if (!Editor) return;

    var origSetKeyboardHandler = Editor.prototype.setKeyboardHandler;
    Editor.prototype.setKeyboardHandler = function (keyboardHandler, cb) {
        origSetKeyboardHandler.call(this, keyboardHandler, cb);
        // After setting, check if it's the vscode handler and patch addLineAfter
        var handler = this.getKeyboardHandler();
        if (handler && handler.commandKeyBinding) {
            var commands = handler.commands;
            if (commands && commands.addLineAfter) {
                // Rebind addLineAfter to Shift-Enter
                handler.removeCommand("addLineAfter");
                handler.addCommand({
                    name: "addLineAfter",
                    bindKey: { mac: "Shift-Enter", win: "Shift-Enter" },
                    exec: function (editor) {
                        editor.commands.exec("addLineAfter", editor);
                    }
                });
            }
        }
    };
}

// ---------------------------------------------------------------------------
// 5. Streamlit theme replacement workaround
//    When switching between streamlit_light and streamlit_dark, the old theme's
//    CSS element is not removed. This patch ensures the opposite theme is
//    cleaned up on theme change.
// ---------------------------------------------------------------------------
function patchStreamlitThemeSwitch(ace) {
    var dom = ace.require("ace/lib/dom");
    var VirtualRenderer = ace.require("ace/virtual_renderer");
    if (!VirtualRenderer || !VirtualRenderer.VirtualRenderer) return;

    var VR = VirtualRenderer.VirtualRenderer;
    var origSetTheme = VR.prototype.setTheme;

    VR.prototype.setTheme = function (theme, cb) {
        var self = this;
        var origCb = cb;
        var wrappedCb = function () {
            // After theme is applied, clean up opposite streamlit theme
            if (self.theme) {
                if (self.theme.cssClass === "ace-streamlit-light") {
                    dom.removeElementById("ace-streamlit-dark");
                } else if (self.theme.cssClass === "ace-streamlit-dark") {
                    dom.removeElementById("ace-streamlit-light");
                }
            }
            if (origCb) origCb();
        };
        origSetTheme.call(this, theme, wrappedCb);
    };
}

// ---------------------------------------------------------------------------
// 6. Register custom Streamlit themes with Ace's module system
//    This makes the themes available via ace.setTheme("ace/theme/streamlit_light")
//    without embedding them in the core ace.js file.
//    The actual theme files are in patches/themes/ and should be loaded
//    via script tags or import before calling this.
// ---------------------------------------------------------------------------
function registerStreamlitThemes(ace) {
    // Themes are registered by loading the standalone theme files.
    // They use ace.define() which auto-registers with Ace's module system.
    // This function is a no-op if themes are loaded via script tags.
    // If using a bundler, import the theme files before calling applyAllPatches.
}

// ---------------------------------------------------------------------------
// 7. Add Streamlit Dark to the theme list (ext-themelist)
// ---------------------------------------------------------------------------
function patchThemeList(ace) {
    var themelist = ace.require("ace/ext/themelist");
    if (!themelist) return;

    var hasStreamlitDark = themelist.themes && themelist.themes.some(function (t) {
        return t.name === "Streamlit Dark";
    });
    if (!hasStreamlitDark && themelist.themes) {
        themelist.themes.push({
            caption: "Streamlit Dark",
            theme: "ace/theme/streamlit_dark",
            isDark: true,
            name: "Streamlit Dark"
        });
    }

    var hasStreamlitLight = themelist.themes && themelist.themes.some(function (t) {
        return t.name === "Streamlit Light";
    });
    if (!hasStreamlitLight && themelist.themes) {
        themelist.themes.push({
            caption: "Streamlit Light",
            theme: "ace/theme/streamlit_light",
            isDark: false,
            name: "Streamlit Light"
        });
    }
}

// ---------------------------------------------------------------------------
// Apply all patches at once
// ---------------------------------------------------------------------------
function applyAllPatches(ace) {
    patchHiDpi(ace);
    patchBackgroundTokenizer(ace);
    patchSnippetRemoval(ace);
    patchVscodeKeybinding(ace);
    patchStreamlitThemeSwitch(ace);
    registerStreamlitThemes(ace);
    patchThemeList(ace);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        applyAllPatches: applyAllPatches,
        patchHiDpi: patchHiDpi,
        patchBackgroundTokenizer: patchBackgroundTokenizer,
        patchSnippetRemoval: patchSnippetRemoval,
        patchVscodeKeybinding: patchVscodeKeybinding,
        patchStreamlitThemeSwitch: patchStreamlitThemeSwitch,
        registerStreamlitThemes: registerStreamlitThemes,
        patchThemeList: patchThemeList
    };
}

if (typeof window !== "undefined") {
    window.acePatches = {
        applyAllPatches: applyAllPatches,
        patchHiDpi: patchHiDpi,
        patchBackgroundTokenizer: patchBackgroundTokenizer,
        patchSnippetRemoval: patchSnippetRemoval,
        patchVscodeKeybinding: patchVscodeKeybinding,
        patchStreamlitThemeSwitch: patchStreamlitThemeSwitch,
        registerStreamlitThemes: registerStreamlitThemes,
        patchThemeList: patchThemeList
    };
}
