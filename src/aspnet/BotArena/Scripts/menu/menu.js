var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.visualizers = gosuArena.visualizers || {};

gosuArena.factories.createMenu = function () {

    var engine;
    var canvas;
    var scene;
    var camera;
    var meshInstance;
    var rotation = 0.0;

    function initialize() {
        canvas = document.getElementById("menu-canvas");
        gosuArena.visualizers.menuVisualizer = new BABYLON.Engine(canvas, true);
        engine = gosuArena.visualizers.menuVisualizer;

        scene = new BABYLON.Scene(engine);

        camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);

        camera.setTarget(BABYLON.Vector3.Zero());

        camera.attachControl(canvas, false);

        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "ship.babylon", scene, function (meshes) {
            var mesh = meshes[1];
            
            meshInstance = mesh.createInstance("meshe");

            meshInstance.position.x = 0;
            meshInstance.position.y = 0;
            meshInstance.position.z = 0;

            meshInstance.scaling = new BABYLON.Vector3(2, 2, 2);

        });


        engine.runRenderLoop(function () {
            if (meshInstance) {
                rotation += 0.01;
                meshInstance.rotation = new BABYLON.Vector3(0, rotation, 0);
            }

            scene.render();
        });

        $("#main-menu-btn").click(function () {
            slideInLeft($("#container-1"));
        });

        $("#close-menu").click(function () {
            slideOutLeft($("#container-1"));
        });

        t();
    }

    function slideInLeft(element) {
        clearTransitions(element);
        element.addClass("slide-in-left");
    }

    function slideOutLeft(element) {
        clearTransitions(element);
        element.addClass("slide-out-left");
    }

    function clearTransitions(element) {
        element.removeClass("slide-in-left");
        element.removeClass("slide-out-left");
    }

    function t() {
        var stage = 1;
        $("#cube-rotate-btn").click(function () {
            if (stage == 1) {
                $(".cube").addClass("rotate-90");
            }
            else if (stage == 2) {
                $(".cube").addClass("rotate-180");
            }
            else if (stage == 3) {
                $(".cube").addClass("rotate-270");
            }
            if (stage == 4) {
                $(".cube").removeClass("rotate-270");
            }
            else if (stage == 5) {
                $(".cube").removeClass("rotate-180");
            }
            else if (stage == 6) {
                $(".cube").removeClass("rotate-90");
            }
            stage++;
            if (stage == 7) {
                stage = 1;
            }
        });
    }

    return {
        initialize: initialize,
    };
};