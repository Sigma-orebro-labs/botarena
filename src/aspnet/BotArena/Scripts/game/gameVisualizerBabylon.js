var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizerBabylon = function (canvas) {


    var scene;
    var engine;

    function initialize(arenaState) {
        console.log(arenaState);
        
        arenaState.onTick(function() {
            update(arenaState);
        });
        engine = new BABYLON.Engine(canvas, true);

        scene = createScene(canvas);
        setUpLights();
        assignBotModels(arenaState);


        engine.runRenderLoop(function () {

            scene.render();
        });
        
        /*
        BABYLON.SceneLoader.Load("Content/models/", "newer_mountains.babylon", engine, function(newScene) {

            scene = newScene;
            // Wait for textures and shaders to be ready
            scene.executeWhenReady(function() {
                assignBotModels(arenaState);
                // Attach camera to canvas inputs
                newScene.activeCamera.attachControl(canvas);
                newScene.activeCamera.maxZ = 5000;


                /*var box = BABYLON.Mesh.CreateBox("box", 6.0, scene);
                var sphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 10.0, scene);

                box.position = new BABYLON.Vector3(0, 0, 10);
                sphere.position = new BABYLON.Vector3(-10, 0, 10);
*//*
                // Once the scene is loaded, just register a render loop to render it
                engine.runRenderLoop(function() {

                    scene.render();
                });

            });
        }); */
    }

    function update(arenaState) {
        updateBots(arenaState);
        updateSunLight();
        setUpTerrain(arenaState);
    }

    var createScene = function (canvas) {

       
        var newScene = new BABYLON.Scene(engine);

        BABYLON.SceneLoader.ImportMesh("", "Content/models/", "m_plane.babylon", newScene, function (newMeshes, particleSystems) {
            var plane = newMeshes[0];
            plane.scaling = new BABYLON.Vector3(100, 100, 100);
            plane.position = new BABYLON.Vector3(-1000, 0, 800);
            plane.convertToFlatShadedMesh();

        });

        

        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(5000, 1000, 0), newScene);
        camera.rotation = new BABYLON.Vector3(0.2, -Math.PI / 2, 1);
        camera.speed = 40;
        
        
        newScene.activeCamera = camera;
        camera.attachControl(canvas, false);

        var lineY = BABYLON.Mesh.CreateLines("Y", [
           new BABYLON.Vector3(0, 0, 0),
           new BABYLON.Vector3(0, 400, 0)
        ], newScene);

        lineY.color = new BABYLON.Color3(0, 254, 0);

        var lineX = BABYLON.Mesh.CreateLines("X", [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(400, 0, 0)
        ], newScene);

        lineX.color = new BABYLON.Color3(0, 0, 254);

        var lineZ = BABYLON.Mesh.CreateLines("Z", [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 400)
        ], newScene);

        lineZ.color = new BABYLON.Color3(254, 0, 0);




        return newScene;
    };


    function setUpLights() {

        var intensity = 2;

        var light0 = new BABYLON.DirectionalLight("Sun", new BABYLON.Vector3(0, -10, 0), scene);
        light0.intensity = 2;

        // add a light to every corner of the playing field
        var cornerLight0 = new BABYLON.PointLight("cornerLight0", new BABYLON.Vector3(462.5, 100, 262.5), scene);
        cornerLight0.diffuse = new BABYLON.Color3(1, 0.483, 0.029);
        cornerLight0.intensity = intensity;

        var cornerLight1 = new BABYLON.PointLight("cornerLight1", new BABYLON.Vector3(-312.5, 100, 262.5), scene);
        cornerLight1.diffuse = new BABYLON.Color3(1, 0, 0);
        cornerLight1.intensity = intensity;

        var cornerLight2 = new BABYLON.PointLight("cornerLight2", new BABYLON.Vector3(-25, 100, -25), scene);
        cornerLight2.diffuse = new BABYLON.Color3(0,1, 0);
        cornerLight2.intensity = intensity;

        var cornerLight3 = new BABYLON.PointLight("cornerLight3", new BABYLON.Vector3(-25, 100, 550), scene);
        cornerLight3.diffuse = new BABYLON.Color3(0, 0, 1);
        cornerLight3.intensity = intensity;
    };

    function setUpTerrain(arenaState) {
        
    };

    function assignBotModels(arenaState) {

        for (var i = 0; i < arenaState.bots.length; i++) {

            var testBot = BABYLON.Mesh.CreateCylinder("testbot", 20, 20, 20, 6, 1, scene, false);
            testBot.position = new BABYLON.Vector3(0, 10, 0);

            var bot = arenaState.bots[i];

                if (i % 2 == 0) {
                    bot.babylonMesh = BABYLON.Mesh.CreateBox("bot" + i, 50.0, scene);
                    bot.babylonMesh.position.x = bot.x;
                    bot.babylonMesh.position.z = bot.y;
                }
                else {
                    bot.babylonMesh = BABYLON.Mesh.CreateCylinder("bot" + i, 50, 50, 50, 6, 1, scene, false);
                    bot.babylonMesh.position.x = bot.x;
                    bot.babylonMesh.position.z = bot.y;
                }
        }
    }

    function updateBots(arenaState) {
        
        for (var i = 0; i < arenaState.bots.length; i++) {

            var bot = arenaState.bots[i];


            if (bot.babylonMesh !== undefined) {

                bot.babylonMesh.position.x = bot.x;
                bot.babylonMesh.position.z = bot.y;

            }
        }
    }

    function updateSunLight() {

        var sun = scene.getLightByName("Sun");
        sun.direction.x -= 0.01;
        sun.direction.y += 0.01;

        

    }


    return {
        initialize: initialize
    };
}