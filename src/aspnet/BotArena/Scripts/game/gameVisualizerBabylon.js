var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizerBabylon = function (canvas) {


    var scene;
    var engine;


    var shipAndBulletYvalue = 100;
    var skybox;

    function initialize(arenaState) {

        console.log(arenaState);
        arenaState.onBotKilled(onBotKilled);
        arenaState.onBulletHitBot(onBulletRemoved);
        arenaState.onBulletHitTerrain(onBulletRemoved);
        arenaState.onTick(function() {
            update(arenaState);
        });


        engine = new BABYLON.Engine(canvas, true);

        scene = createScene(canvas);
        setUpLights();
        assignBotModels(arenaState);
        setUpTerrain(arenaState);
        
        setUpSkyBox();        


        engine.runRenderLoop(function () {

            scene.render();
        });
        
    }

    function setUpSkyBox() {


        skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Content/textures/skybox/", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }

    function update(arenaState) {
        updateBots(arenaState);
        updateSunLight();
        
        updateBullets(arenaState);
    }

    var createScene = function (canvas) {
       
        var newScene = new BABYLON.Scene(engine);

        BABYLON.SceneLoader.ImportMesh("", "Content/models/", "m_plane.babylon", newScene, function (newMeshes, particleSystems) {
            var plane = newMeshes[0];
            plane.scaling = new BABYLON.Vector3(100, 100, 100);
            plane.position = new BABYLON.Vector3(-1000, 0, 800);
            plane.convertToFlatShadedMesh();

        });        

        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(1500, 650, 400), newScene);
        newScene.activeCamera = camera;
        camera.attachControl(canvas, false);
        camera.rotation = new BABYLON.Vector3(Math.PI / 7, -Math.PI / 2, 0);
        camera.rotation.z = -Math.PI / 4;
        camera.speed = 40;        
        

        var lineY = BABYLON.Mesh.CreateLines("Y", [
           new BABYLON.Vector3(0, 0, 0),
           new BABYLON.Vector3(0, 4000, 0)
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

        //var sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(60, 100, 10), scene);

        var light0 = new BABYLON.DirectionalLight("Sun", new BABYLON.Vector3(0, -10, 0), scene);
        light0.intensity = 2;

        /*BABYLON.Engine.ShadersRepository = "";
        var water = BABYLON.Mesh.CreateGround("water", 1000, 1000, 1, scene, false);
        var waterMaterial = new WaterMaterial("water", scene, sun);
        //waterMaterial.refractionTexture.renderList.push(extraGround);
        //waterMaterial.refractionTexture.renderList.push(ground);

        //waterMaterial.reflectionTexture.renderList.push(ground);
        waterMaterial.reflectionTexture.renderList.push(skybox);

        water.material = waterMaterial;*/

        };

    function setUpTerrain(arenaState) {

        for (var i = 0; i < arenaState.terrain.length; i++) {

            var terrain = arenaState.terrain[i];
            var tempSphere = BABYLON.Mesh.CreateSphere("sphere", 10.0, 40.0, scene);
            var tempPosition = terrain.center();

            tempSphere.position.z = tempPosition.x;
            tempSphere.position.x = tempPosition.y;
            tempSphere.position.y = shipAndBulletYvalue;
                 
        }       
    };       
    

    function assignBotModels(arenaState) {


        BABYLON.SceneLoader.ImportMesh("", "Content/models/", "ship.babylon", scene, function (newMeshes, particleSystems) {

            var mesh = newMeshes[1];
            mesh.convertToFlatShadedMesh();

            for (var i = 0; i < arenaState.bots.length; i++) {

                var bot = arenaState.bots[i];


                bot.babylonMesh = mesh.createInstance("bot" + i);


                bot.babylonMesh.position.x = bot.y;
                bot.babylonMesh.position.y = shipAndBulletYvalue;
                bot.babylonMesh.position.z = bot.x;

                bot.babylonMesh.scaling = new BABYLON.Vector3(10, 10, 10);
            }
        });
    }

    function updateBots(arenaState) {
        
        for (var i = 0; i < arenaState.bots.length; i++) {

            var bot = arenaState.bots[i];

            if (bot.babylonMesh !== undefined) {

                bot.babylonMesh.position.x = bot.y;
                bot.babylonMesh.position.z = bot.x;
                bot.babylonMesh.rotation.y = Math.PI + gosu.math.degreesToRadians(bot.angle);
            }
        }
    }

    function updateSunLight() {
        var sun = scene.getLightByName("Sun");
        sun.direction.x -= 0.01;
        sun.direction.y += 0.01;
    }

    function onBulletRemoved(bullet) {
        removeMeshFromScene(bullet.babylonMesh);
    }

    function removeMeshFromScene(mesh) {
        if (mesh) {
            mesh.dispose();
        }
    }

    function updateBullets(arenaState) {

        var bullets = arenaState.bullets;

        for (var i = 0; i < bullets.length; i++) {

            var bullet = bullets[i];

            if (bullet.babylonMesh === undefined) {

                bullet.babylonMesh = BABYLON.Mesh.CreateSphere("bullet", 5.0, 5.0, scene);
                bullet.babylonMesh.color = new BABYLON.Color3.Black();
                bullet.babylonMesh.position.y = shipAndBulletYvalue;
            }

            bullet.babylonMesh.position.x = bullet.y;
            bullet.babylonMesh.position.z = bullet.x;
        }
    }

    function onBotKilled(bot) {

        bot.babylonMesh.dispose();

    }

    return {
        initialize: initialize
    };
}