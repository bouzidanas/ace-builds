ace.define("ace/theme/streamlit_dark.css", ["require", "exports", "module"], function (require, exports, module) {
    module.exports = "\n@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');\n:root {\n        --streamlit-dark-font-family: 'Source Code Pro', monospace;\n        --streamlit-dark-background-color: #1a1c24;\n        --streamlit-dark-info-color: #5c6370;\n        --streamlit-dark-select-color: #24272f;\n        --streamlit-dark-select-highlight-color: #3d4350;\n        --streamlit-dark-primary-text-color: whitesmoke;\n        --streamlit-dark-secondary-text-color: #c1c1c1;\n        --streamlit-dark-root-border-radius: 8px;\n        --streamlit-dark-editor-border-radius: 8px;\n        --streamlit-dark-active-line-highlight-color: rgba(76, 87, 103, .19);\n        --streamlit-dark-box-shadow-color: rgb(0 0 0 / 51%);\n        --streamlit-dark-scrollbar-margin: 6px;\n}\ndiv ::-webkit-scrollbar {\n    background: transparent;\n   width: 6px;\n   opacity: 0.4;\n}\ndiv ::-webkit-scrollbar-track {\n    background:transparent;\n}\ndiv ::-webkit-scrollbar-thumb {\n    background: rgba(255,255,255, 0.1);\n    border-radius: 100px;\n}\ndiv ::-webkit-scrollbar-thumb:hover {\n    background: rgba(255,255,255, 0.35);}\nbody {\n        color-scheme: dark;\n}\n#root > .streamlit_code-editor > #REACT_ACE_EDITOR {\n        order:3;\n}\n#root~div {\n        background: var(--streamlit-dark-background-color);\n        border-radius: var(--streamlit-light-root-border-radius);\n        color: var(--streamlit-dark-secondary-text-color);\n        font: var(--streamlit-dark-font-family);\n        overflow: hidden;\n}\n#root~div #kbshortcutmenu {\n        border-radius: var(--streamlit-dark-root-border-radius)!important;\n        padding-top: 3rem;\n        right: unset;\n       left: 0px;\n        box-shadow: 2px 0px 9px var(--streamlit-dark-box-shadow-color);\n        background: var(--streamlit-dark-background-color);\n        border-radius: var(--streamlit-dark-editor-border-radius);\n        color: var(--streamlit-dark-secondary-text-color);\n        color-scheme: dark;\n        font: var(--streamlit-dark-font-family);\n}\n#root~div #kbshortcutmenu .ace_optionsMenuEntry  span.ace_optionsMenuCommand {\n        font-weight: bold;\n}\n#root~div #kbshortcutmenu  .ace_optionsMenuEntry  span.ace_optionsMenuKey {\n        color: var(--primary-color)\n}\n#root~div .ace_prompt_container {\n        width: unset;\n        margin-top: 8.1%;\n        margin-left: auto;\n        margin-right: auto;\n        background: var(--streamlit-dark-background-color);\n        caret-color: var(--primary-color);\n        border-radius: var(--streamlit-dark-editor-border-radius);\n        border: 1px solid var(--primary-color);\n        box-shadow: 0px 2px 8px var(--streamlit-dark-box-shadow-color);\n        padding: 8px;\n        border-color: var(--primary-color);\n}\n#root~div .ace_prompt_container .ace_editor .ace_scrollbar {\n        margin-left: -1rem;\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm {\n        background-color: inherit;\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm .ace_cursor {\n       margin-top: 0px;\n        color: var(--streamlit-dark-secondary-text-color);\n        caret-shape: underscore;\n}\n .ace_prompt_container .ace_editor.ace-tm .ace_marker-layer .ace_selected-word, .ace_prompt_container .ace_editor.ace-tm .ace_marker-layer .ace_selection {\n        border: none;\n       background: var(--streamlit-dark-select-highlight-color);\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm .ace_scroller {\n        color: var(--streamlit-dark-secondary-text-color);\n    right: 0px!important;\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm.ace_autocomplete .ace_scroller .ace_content .ace_text-layer > .ace_line {\n        padding-left: 0.3rem;\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm .ace_scroller span.ace_completion-highlight {\n        color: var(--primary-color);\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm .ace_scroller span.ace_completion-message {\n        color: var(--primary-color); font-weight: bold;\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm.ace_autocomplete .ace_marker-layer .ace_line-hover {\n        border: 1px solid var(--primary-color);\n        margin-right: 1px;\n        background-color: var(--streamlit-dark-select-color);\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm.ace_autocomplete .ace_marker-layer .ace_active-line{\n       background-color: var(--streamlit-dark-select-color);\n}\n#root~div .ace_prompt_container .ace_editor.ace-tm.ace_autocomplete {\n        font: var(--streamlit-dark-font-family);\n        width: 84%!important;\n        padding-left: 0.2em!important;\n        margin-left: -0.3rem;\n     margin-top: 0.6rem!important;\n        border: none;\n        box-shadow: 0px 4px 9px var(--streamlit-dark-box-shadow-color);\n}\n.ace-streamlit-dark.ace_editor {\n        font-family: var(--streamlit-dark-font-family);\n       overflow: hidden;\n}\n.ace-streamlit-dark.ace_editor .ace_search {\n        background: inherit;\n        border: 1px solid var(--primary-color);\n        border-radius: 4px 0px 0px 4px;\n        box-shadow: -4px 3px 8px var(--streamlit-dark-box-shadow-color);\n        color: var(--streamlit-dark-info-color);\n        margin-top: 25px;\n        margin-right: 1px;\n        padding: 7px 6px 0 7px;\n        opacity: 1;\n        z-index: 999;\n}\n.ace-streamlit-dark.ace_editor .ace_search .ace_search_form span {\n        border-radius: var(--streamlit-dark-editor-border-radius);\n}\n.ace-streamlit-dark.ace_editor .ace_search .ace_search_form span.prev {\n        margin-left: 1px;\n        padding-left: 11px;\n        padding-right: 8px;\n}\n.ace-streamlit-dark.ace_editor .ace_search .ace_search_form span.next {\n        padding-left: 8px;\n        padding-right: 12px;\n}\n.ace-streamlit-dark.ace_editor .ace_search .ace_search_form span:hover {\n        background-color: var(--streamlit-dark-select-color);\n}\n.ace-streamlit-dark.ace_editor .ace_search .ace_search_field {\n        background-color: var(--streamlit-dark-select-color);\n        border: 1px solid var(--primary-color);\n        border-radius: var(--streamlit-dark-editor-border-radius);\n        color: var(--streamlit-dark-secondary-text-color);\n}\n.ace-streamlit-dark.ace_editor .ace_search span:after {\n        border-color: #666;\n}\n.ace-streamlit-dark.ace_editor .ace_search span:hover:after {\n        border-color: var(--primary-color);\n}\n.ace-streamlit-dark.ace_editor .ace_search .ace_search_form span:active:after {\n        border-color: var(--streamlit-dark-primary-text-color);\n}\n.ace-streamlit-dark.ace_editor .ace_search span {\n        background-color: var(--streamlit-dark-background-color);\n        border: none;\n}\n.ace-streamlit-dark.ace_editor .ace_search span:hover {\n        color: var(--primary-color);\n}\n.ace-streamlit-dark.ace_editor .ace_search .ace_search_form span:active {\n        background-color: var(--primary-color);\n        color: var(--streamlit-dark-primary-text-color);\n}\n.ace-streamlit-dark.ace_editor .ace_replace_form span:active {\n        background-color: var(--primary-color);\n        color: var(--streamlit-dark-primary-text-color);\n}\ninput.ace_search_field::selection {\n        background-color: var(--streamlit-dark-select-highlight-color);\n        color: var(--streamlit-dark-primary-text-color) !important;\n}\ninput.ace_search_field::-moz-selection {\n        background-color: var(--streamlit-dark-select-highlight-color);\n        color: var(--streamlit-dark-info-color);\n}\n.ace-streamlit-dark .ace_search .ace_search_options .ace_button {\n        color: var(--streamlit-dark-info-color);\n        opacity: 1;\n}\n.ace-streamlit-dark .ace_search .ace_search_options .ace_button:hover {\n        background-color: var(--streamlit-dark-select-color);\n}\n.ace-streamlit-dark .ace_search .ace_search_options .ace_button:active {\n        background-color: var(--primary-color);\n        color: var(--streamlit-dark-primary-text-color);\n}\n.ace-streamlit-dark .ace_search .ace_search_options .ace_button.checked {\n        border: 1px solid var(--primary-color) !important;\n}\n.ace-streamlit-dark.ace_editor+.ace_tooltip.ace_doc-tooltip {\n        background-color: var(--streamlit-dark-select-color);\n        background-image: none;\n        border: none;\n        border-radius: var(--streamlit-dark-editor-border-radius);\n        box-shadow: 2px 3px 9px var(--streamlit-dark-box-shadow-color);\n        color: var(--streamlit-dark-secondary-text-color);\n        font-family: var(--streamlit-dark-font-family);\n        font-size: 12px;\n        padding: 1rem;\n        position: absolute;\n}\n.ace-streamlit-dark.ace_editor+.ace_tooltip.ace_doc-tooltip>hr {\n        border-top: 1px dashed var(--streamlit-dark-secondary-text-color);\n        margin-top: 6px;\n}\n.ace-streamlit-dark .ace_tooltip {\n        background: var(--streamlit-dark-background-color);\n        border: 1px solid var(--primary-color);\n        border-radius: var(--streamlit-dark-editor-border-radius);\n        box-shadow: 2px 3px 9px var(--streamlit-dark-box-shadow-color);\n        color: var(--primary-color);\n}\n.ace-streamlit-dark .ace_gutter {\n        background: inherit;\n        color: #6a6f7a;\n}\n.ace-streamlit-dark .ace_print-margin {\n        background: var(--streamlit-dark-select-highlight-color);\n        width: 1px;\n}\n.ace-streamlit-dark {\n        background-color: var(--streamlit-dark-background-color);\n        border-radius: var(--streamlit-dark-editor-border-radius);\n        color: var(--streamlit-dark-primary-text-color);\n        color-scheme: dark;\n        line-height: 1.5rem !important;\n}\n#root~div.ace-streamlit-dark.ace_editor.ace_autocomplete {\n        background-color: var(--streamlit-dark-background-color);\n        border: none;\n        border-radius: var(--streamlit-dark-editor-border-radius);\n        box-shadow: 2px 3px 9px var(--streamlit-dark-box-shadow-color);\n        min-width: 30ch;\n        width: 20ch;\n}\n.ace-streamlit-dark.ace_editor.ace_autocomplete .ace_scroller {\n        margin-right: 1px;\n     margin-top: 3px;\n}\n.ace-streamlit-dark.ace_editor.ace_autocomplete .ace_marker-layer {\n        overflow: unset;\n        margin-top: 1px;\n}\n.ace-streamlit-dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_line-hover {\n        background-color: var(--streamlit-dark-active-line-highlight-color);\n        border: 1px solid var(--primary-color);\n}\n.ace-streamlit-dark.ace_dark.ace_editor.ace_autocomplete .ace_completion-highlight {\n        color: var(--primary-color);\n}\n.ace-streamlit-dark.ace_autocomplete .ace_completion-meta {\n        color: #6d7584;\n        opacity: 1;\n}\n.ace-streamlit-dark.ace_dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n        background-color: var(--streamlit-dark-active-line-highlight-color);\n}\n\n.ace-streamlit-dark.ace_editor .ace_scroller {\n        right: 0px !important;\n}\n.ace-streamlit-dark.ace_editor .ace_scroll-left .ace_content {\n    width: unset!important;\n    right: 0px!important;\n}\n.ace_scrollbar-h::-webkit-scrollbar {\n    height: 6px;}\n\n.ace_scrollbar-v::-webkit-scrollbar {\n    width: 6px;\n}\nhtml .ace_scrollbar {\n    background: transparent;}\nhtml .ace_scrollbar-v {\n     width: 7px!important;\n    bottom: 1px!important;\n     top: 1px!important;\n    height: unset!important;\n}\nhtml .ace_scrollbar-v:hover::-webkit-scrollbar-thumb {\n   background: rgba(255,255,255, 0.35);\n}\nhtml .ace_scrollbar-h {\n     height: 7px!important;\n     right:1px!important;\n     width: unset!important;\n}\nhtml .ace_scrollbar-h:hover::-webkit-scrollbar-thumb {\n   background: rgba(255,255,255, 0.35);\n}\n.ace-streamlit-dark .ace_scrollbar-v {\n     width: 7px!important;\n    bottom: var(--streamlit-dark-scrollbar-margin)!important;\n     top: var(--streamlit-dark-scrollbar-margin)!important;\n    height: unset!important;\n}\n.ace-streamlit-dark .ace_scrollbar-h {\n     height: 7px!important;\n     right: var(--streamlit-dark-scrollbar-margin)!important;\n     width: unset!important;\n}\n.ace-streamlit-dark .ace_cursor {\n        color: #528bff;\n}\n.ace-streamlit-dark .ace_marker-layer .ace_selection {\n        background: var(--streamlit-dark-select-highlight-color);\n}\n.ace-streamlit-dark.ace_multiselect .ace_selection.ace_start {\n        border-radius: 2px;\n        box-shadow: 0 0 3px 0 var(--streamlit-dark-background-color);\n}\n.ace-streamlit-dark .ace_marker-layer .ace_step {\n        background: #c6dbae;\n}\n.ace-streamlit-dark .ace_marker-layer .ace_bracket {\n        border: 1px solid var(--primary-color);\n        border-radius: unset;\n}\n.ace-streamlit-dark .ace_marker-layer .ace_active-line {\n        background: var(--streamlit-dark-active-line-highlight-color);\n}\n.ace-streamlit-dark .ace_gutter-active-line {\n        background-color: var(--streamlit-dark-active-line-highlight-color);\n}\n.ace-streamlit-dark .ace_marker-layer .ace_selected-word {\n        border: 1px solid var(--streamlit-dark-select-highlight-color);\n}\n.ace-streamlit-dark .ace_gutter-cell.ace_error {\n        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA1klEQVR4nGNgoCX4r6RkAsLkaVZUVPuvqPgditVIN0BBYet/RcX/YKygsIVU213hmmFYXt6TOM3Gxqz/FRVvYBigoHD7v4oKOzG2FyHZmgHGCIOK8GtWUhL7r6j4HsnW1P8KCmlI/I//5eUlcBugoDAbzdm5/xUU8tC8Mwu7Zjk5o/+Kin/RDNiKEhsQ/Pe/vLwhqmYGBsb/CgqHMQJOUfHsf0XFc1gC9BBID8IAefkILJpBuAuKMeUUFMKR/X4FhwG4sYLCFWQDev4rKt4lEXcRTBN0AQCAzfRkqAjjcwAAAABJRU5ErkJggg==);\n        margin-left: 1px;\n}\n.ace-streamlit-dark .ace_fold {\n        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA90lEQVR4nGNgYGBgyCwsdMwpKCrLzi8ux4ZzCorKQGpAahlyCoqdsguK/xODM0GasvKLS4nVkJVfXMoAdkpB8f/6lo7/hWWVGIqKyirBciA2SC1YQ21T2/8rt+7+b+nswdDQ0tXz/9LNO/9LK2sQGtZs3PL/0o3b/9dt2fZ/0ozZ/5euXvd/9oJF/+cuWvp/8crV/4+ePvd/ysw5CA2r1m/6f+XWvf9rN2/7P2n6LAwNh0+e/T911lyEhprGtv837z/6P33uAqxOugxyUlUtQgNIYsLUmf8rahswPV1e9b+hFcnTZAQr8RGXnV/sAI5tEINQ0oApBgCFUEId5TDwNAAAAABJRU5ErkJggg==) !important;\n        border: none !important;\n        opacity: 0.2;\n        width: fit-content !important;\n}\n.ace-streamlit-dark .ace_fold:hover {\n    opacity: 0.5;\n}\n.ace-streamlit-dark .ace_indent-guide {\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ09NrYAgMjP4PAAtGAwchHMyAAAAAAElFTkSuQmCC) right repeat-y;\n}\n.ace-streamlit-dark .ace_indent-guide-active {\n    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAAZSURBVHjaYvj///9/hivKyv8BAAAA//8DACLqBhbvk+/eAAAAAElFTkSuQmCC) right repeat-y;\n}\n/* Token styling */\n.ace-streamlit-dark .ace_keyword {\n        color: rgb(28, 131, 225);\n}\n.ace-streamlit-dark .ace_punctuation {\n        color: rgb(153, 153, 153);\n}\n.ace-streamlit-dark .ace_paren {\n        color: rgb(153, 153, 153);\n}\n.ace-streamlit-dark .ace_keyword.ace_operator {\n        color: rgb(237, 111, 19);\n}\n.ace-streamlit-dark .ace_keyword.ace_other.ace_unit {\n        color: #d19a66;\n}\n.ace-streamlit-dark .ace_constant.ace_language {\n        color: #d19a66;\n}\n.ace-streamlit-dark .ace_constant.ace_numeric {\n        color: rgb(41, 176, 157);\n}\n.ace-streamlit-dark .ace_constant.ace_character {\n        color: #56b6c2;\n}\n.ace-streamlit-dark .ace_constant.ace_other {\n        color: #56b6c2;\n}\n.ace-streamlit-dark .ace_support.ace_function {\n}\n.ace-streamlit-dark .ace_support.ace_constant {\n        color: #d19a66;\n}\n.ace-streamlit-dark .ace_support.ace_class {\n        color: #e5c07b;\n}\n.ace-streamlit-dark .ace_support.ace_type {\n        color: #e5c07b;\n}\n.ace-streamlit-dark .ace_storage {\n        color: #c678dd;\n}\n.ace-streamlit-dark .ace_storage.ace_type {\n        color: #c678dd;\n}\n.ace-streamlit-dark .ace_invalid {\n        background-color: #f2777a;\n        color: #fff;\n}\n.ace-streamlit-dark .ace_invalid.ace_deprecated {\n        background-color: #d27b53;\n        color: #272b33;\n}\n.ace-streamlit-dark .ace_string {\n        color: rgb(9, 171, 59);\n}\n.ace-streamlit-dark .ace_string.ace_regexp {\n        color: #e06c75;\n}\n.ace-streamlit-dark .ace_comment {\n        color: var(--streamlit-dark-info-color);\n        font-style: italic;\n}\n.ace-streamlit-dark .ace_variable {\n        color: #e06c75;\n}\n.ace-streamlit-dark .ace_variable.ace_parameter {\n        color: #d19a66;\n}\n.ace-streamlit-dark .ace_meta.ace_tag {\n        color: #e06c75;\n}\n.ace-streamlit-dark .ace_entity.ace_other.ace_attribute-name {\n        color: #e06c75;\n}\n.ace-streamlit-dark .ace_entity.ace_name.ace_function {\n        color: #61afef;\n}\n.ace-streamlit-dark .ace_entity.ace_name.ace_tag {\n        color: #e06c75;\n}\n.ace-streamlit-dark .ace_markup.ace_heading {\n        color: #98c379;\n}\n";

});

ace.define("ace/theme/streamlit_dark", ["require", "exports", "module", "ace/theme/streamlit_dark.css", "ace/lib/dom"], function (require, exports, module) {
    exports.isDark = true;
    exports.cssClass = "ace-streamlit-dark";
    exports.cssText = require("./streamlit_dark.css");
    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass, false);
    
}); (function () {
    ace.require(["ace/theme/streamlit_dark"], function (m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();
