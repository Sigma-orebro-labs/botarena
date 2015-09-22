var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizerBabylon = function (canvas) {


    var scene;
    var engine;
    var sun;
    var canonSound;
    var waterSound;

    var shipAndBulletYvalue = 10;
    var skybox;

    function initialize(arenaState) {

        console.log(arenaState);
        arenaState.onBotKilled(onBotKilled);
        arenaState.onBulletHitBot(onBulletRemoved);
        arenaState.onBulletHitTerrain(onBulletRemoved);
        arenaState.onShotFired(onShotFired);
        arenaState.onTick(function() {
            update(arenaState);
        });


        engine = new BABYLON.Engine(canvas, true);

        scene = createScene(canvas);
        setUpLights();

        setUpSounds();

        assignBotModels(arenaState);
        setUpTerrain(arenaState);
        
        setUpSkyBox();
        setUpWater(arenaState);

        

        engine.runRenderLoop(function () {

            scene.render();
        });
        
    }

    function onShotFired(bot, bullet) {
        canonSound.play();

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
       // updateSunLight();
        skybox.rotation.y -= 0.0001 * scene.getAnimationRatio();
        updateBullets(arenaState);
    }

    var createScene = function (canvas) {
       
        var newScene = new BABYLON.Scene(engine);

       

        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(1500, 650, 400), newScene);
        newScene.activeCamera = camera;
        camera.attachControl(canvas, false);
        camera.rotation = new BABYLON.Vector3(Math.PI / 7, -Math.PI / 2, 0);
        camera.rotation.z = -Math.PI / 4;
        camera.speed = 40;        
        
        

        // create a line for each axis, just for orientation aid. 
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

    function setUpSounds() {
        
        waterSound = new BABYLON.Sound("WaterSound", "Content/sounds/water_sound.wav", scene, null, { loop: true, autoplay: true, volume: 1 });
        waterSound.maxDistance = 3000;

        canonSound = new BABYLON.Sound("CanonSound", "Content/sounds/cork.wav", scene, null, {loop: false, autoplay: false, volume: 0.05});
        canonSound.maxDistance = 7000;
    };


    function setUpLights() {

        sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 4000, 8000), scene);

        var sun2 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(2000, 4000, -8000), scene);
        var sun3 = new BABYLON.PointLight("Omni2", new BABYLON.Vector3(-2000, 4000, -8000), scene);
        

       // sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(0, -5, 0), scene);
        sun.intensity = 4;
    };
    
   
    function setUpTerrain(arenaState) {

        

        //set up material for the walls
        var brickMaterial = new BABYLON.StandardMaterial("bricks", scene);
        brickMaterial.diffuseTexture = new BABYLON.Texture("Content/textures/Brick_Wall_03.jpg", scene);
        brickMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        for (var i = 0; i < arenaState.terrain.length; i++) {

            var terrain = arenaState.terrain[i];
            var tempWall = BABYLON.Mesh.CreateBox("wall_" + i, 1, scene);

            var tempPosition = terrain.center();

            
           

            tempWall.position.z = tempPosition.x;
            tempWall.position.x = tempPosition.y;
            tempWall.position.y = shipAndBulletYvalue;

            if (terrain.angle === 0 || terrain.angle === 180) {
                tempWall.scaling = new BABYLON.Vector3(terrain.width, terrain.height, terrain.height / 2);
            } else {
                tempWall.scaling = new BABYLON.Vector3(terrain.height / 2, terrain.height, terrain.width);
            }

            tempWall.rotation.y = Math.PI / 2;

            tempWall.material = brickMaterial;


        }       
    };       
    

    function setUpWater(arenaState) {

       
        var water = BABYLON.Mesh.CreateGround("water", 10000, 10000, 1, scene, false);
        var waterMaterial = new gosu.WaterMaterial("water", scene, sun);

        waterMaterial.reflectionTexture.renderList.push(skybox);

        water.isPickable = false;
        water.material = waterMaterial;

        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];
            waterMaterial.reflectionTexture.renderList.push(bot.babylonMesh);
        }


        

        waterSound.attachToMesh(water);
    }

    function assignBotModels(arenaState) {


        BABYLON.SceneLoader.ImportMesh("", "Content/models/", "ship.babylon", scene, function (newMeshes, particleSystems) {

            var mesh = newMeshes[1];
            //mesh.convertToFlatShadedMesh();

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

    // a function to fake a sunset
    function updateSunLight() {
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