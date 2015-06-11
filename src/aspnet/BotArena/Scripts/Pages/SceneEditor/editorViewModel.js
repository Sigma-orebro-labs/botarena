var gosuArena = gosuArena || {};
gosuArena.facories = gosuArena.facories || {};

gosuArena.factories.createEditorViewModel = function (sceneEditor) {
    var self = this;

    var meshes = ko.observableArray([
        { name: "Cube" },
        { name: "Sphere" },
        { name: "Plane" }
    ]);

    function onMeshAdd(mesh) {
        sceneEditor.addMesh();
    }

    return {
        meshes: meshes,
        onMeshAdd: onMeshAdd
    }
};