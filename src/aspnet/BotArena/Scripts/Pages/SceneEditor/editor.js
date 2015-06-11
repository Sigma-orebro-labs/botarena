(function () {

    $(function () {
        var canvas = document.getElementById("editor-canvas");
        var sceneEditor = gosuArena.factories.createSceneEditor(canvas);
        sceneEditor.initialize();
        gosuArena.editorViewModel = gosuArena.factories.createEditorViewModel(sceneEditor);

        ko.applyBindings(gosuArena.editorViewModel);
    });

})();
