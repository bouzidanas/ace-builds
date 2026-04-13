/**
 * Runtime monkey-patches for Ace editor — ES Module version.
 *
 * Usage:
 *   import ace from "ace-builds";
 *   import { applyAllPatches } from "ace-builds/patches/ace-patches.mjs";
 *   applyAllPatches(ace);
 */

export function patchHiDpi(ace) {
    var dom = ace.require("ace/lib/dom");
    if (dom) {
        dom.HI_DPI = false;
    }
}

export function patchBackgroundTokenizer(ace) {
    var mod = ace.require("ace/background_tokenizer");
    if (!mod) return;
    var BT = mod.BackgroundTokenizer;
    if (!BT) return;

    BT.prototype.start = function (startRow) {
        if (!this.doc || typeof this.doc.getLength !== "function") return;
        var len = this.doc.getLength();
        if (isNaN(len)) len = Infinity;
        this.currentLine = Math.min(startRow || 0, this.currentLine, len);
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);
        this.stop();
        this.running = setTimeout(this.$worker, 700);
    };
}

export function patchSnippetRemoval(ace) {
    var snippetModule = ace.require("ace/snippets");
    if (!snippetModule) return;
    var mgr = snippetModule.snippetManager;
    if (!mgr) return;

    var origUnregister = mgr.unregister;
    mgr.unregister = function (snippets, scope) {
        var snippetMap = this.snippetMap;
        var snippetNameMap = this.snippetNameMap;

        function removeSnippet(s) {
            var nameMap = snippetNameMap[s.scope || scope];
            if (nameMap && nameMap[s.name]) {
                delete nameMap[s.name];
                var map = snippetMap[s.scope || scope];
                var i = map && map.findIndex(snip => snip.name === s.name);
                if (i >= 0) map.splice(i, 1);
            }
        }

        if (snippets && snippets.content) {
            removeSnippet(snippets);
        } else if (Array.isArray(snippets)) {
            snippets.forEach(removeSnippet);
        }
    };
}

export function patchVscodeKeybinding(ace) {
    var Editor = ace.require("ace/editor");
    if (!Editor || !Editor.Editor) return;

    var origSetKH = Editor.Editor.prototype.setKeyboardHandler;
    Editor.Editor.prototype.setKeyboardHandler = function (keyboardHandler, cb) {
        origSetKH.call(this, keyboardHandler, cb);
        var handler = this.getKeyboardHandler();
        if (handler && handler.commands && handler.commands.addLineAfter) {
            handler.removeCommand("addLineAfter");
            handler.addCommand({
                name: "addLineAfter",
                bindKey: { mac: "Shift-Enter", win: "Shift-Enter" },
                exec: function (editor) {
                    editor.commands.exec("addLineAfter", editor);
                }
            });
        }
    };
}

export function patchStreamlitThemeSwitch(ace) {
    var dom = ace.require("ace/lib/dom");
    var vrMod = ace.require("ace/virtual_renderer");
    if (!vrMod || !vrMod.VirtualRenderer) return;

    var VR = vrMod.VirtualRenderer;
    var origSetTheme = VR.prototype.setTheme;

    VR.prototype.setTheme = function (theme, cb) {
        var self = this;
        origSetTheme.call(this, theme, function () {
            if (self.theme) {
                if (self.theme.cssClass === "ace-streamlit-light")
                    dom.removeElementById("ace-streamlit-dark");
                else if (self.theme.cssClass === "ace-streamlit-dark")
                    dom.removeElementById("ace-streamlit-light");
            }
            if (cb) cb();
        });
    };
}

export function patchThemeList(ace) {
    var themelist = ace.require("ace/ext/themelist");
    if (!themelist || !themelist.themes) return;

    if (!themelist.themes.some(t => t.name === "Streamlit Dark")) {
        themelist.themes.push({
            caption: "Streamlit Dark",
            theme: "ace/theme/streamlit_dark",
            isDark: true,
            name: "Streamlit Dark"
        });
    }
    if (!themelist.themes.some(t => t.name === "Streamlit Light")) {
        themelist.themes.push({
            caption: "Streamlit Light",
            theme: "ace/theme/streamlit_light",
            isDark: false,
            name: "Streamlit Light"
        });
    }
}

export function applyAllPatches(ace) {
    patchHiDpi(ace);
    patchBackgroundTokenizer(ace);
    patchSnippetRemoval(ace);
    patchVscodeKeybinding(ace);
    patchStreamlitThemeSwitch(ace);
    patchThemeList(ace);
}
