var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.visualizers = gosuArena.visualizers || {};

gosuArena.factories.createMenu = function () {

    var engine;
    var canvas;
    var scene;
    var camera;

    function initialize() {
        canvas = document.getElementById("menu-canvas");
        gosuArena.visualizers.menuVisualizer = new BABYLON.Engine(canvas, true);
        engine = gosuArena.visualizers.menuVisualizer;

        scene = new BABYLON.Scene(engine);

        camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);

        camera.setTarget(BABYLON.Vector3.Zero());

        camera.attachControl(canvas, false);

        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        var sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

        sphere.position.y = 1;

        var ground = new BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);


        engine.runRenderLoop(function () {
            scene.render();
        });

        $("#main-menu-btn").click(function () {
            slideInLeft($("#container-1"));
        });
    }

    function slideInLeft(element) {
        $(element).addClass("slide-in-left");
    }

    return {
        initialize: initialize,
    };
};