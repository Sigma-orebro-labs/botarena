$(function () {
    
    CodeMirror.commands.insertSpacesAsTab = function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces, "end", "+input");
    };

    CodeMirror.keyMap["default"]["Tab"] = "insertSpacesAsTab";


    var textArea = document.getElementById("editor");
    var editor = CodeMirror.fromTextArea(textArea, {
        lineNumbers: true,
        mode: "javascript",
        gutters: ["CodeMirror-lint-markers"],
        lint: true,
        matchBrackets: true,
        highlightSelectionMatches: { showToken: /\w/ },
        styleActiveLine: true
    });
});