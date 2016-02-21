var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.visualizers = gosuArena.visualizers || {};

gosuArena.factories.createGameVisualizerBabylon = function (canvas) {

    var shipYValue = 0;
    var bulletYValue = 10;
    var healthBarYValue = 50;
    var wallYValue = 10;
    var explosionYValue = 20;
    var nameTagYValue = 10;

    var scene;
    var sun;
    var canonSound;
    var waterSound;
    var waterMaterial;
    var skybox;
    var landscape;
    var shadowGenerator;
    var ground;
    var engine;
    var healthBarSpritesManager;
    var nameBarSpritesManagers = [];
    var explosionSpriteManager;
    var arenaState;
    var botMeshes = {
        standardClass: null,
        ninja: null,
        tank: null
    };
    var materials = {};

    var particleExplosion;
    var particleSmoke;

    var botsCurrentlyInScene = [];

    function removeBotFromScene(bot) {

        // It seems like the bot is added multiple times to the shadow map,
        // so make sure that all instances are removed from the map, to ensure
        // that no shadow is left in the scene after removing the bot
        var shadowRenderList = shadowGenerator.getShadowMap().renderList;
        while (shadowRenderList.indexOf(bot.babylonMesh) >= 0) {
            shadowRenderList.pop(bot.babylonMesh);
        }

        bot.healthBarSprite.dispose();
        bot.nameBar.dispose();

        animateRotationOfDeadBotMesh(bot.babylonMesh);
    }

    function animateRotationOfDeadBotMesh(mesh) {

        var rotationAnim = new BABYLON.Animation("dead_boat", "rotation.x", 100, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        var keys = [];

        keys.push({
            frame: 0,
            value: 0
        });

        keys.push({
            frame: 50,
            value: Math.PI / 4
        });

        keys.push({
            frame: 100,
            value: Math.PI
        });

        rotationAnim.setKeys(keys);

        var sinkAnim = new BABYLON.Animation("dead_boat", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);

        keys = [];

        keys.push({
            frame: 0,
            value: mesh.position.y
        });

        keys.push({
            frame: 100,
            value: mesh.position.y - 15
        });

        sinkAnim.setKeys(keys);

        mesh.animations.push(sinkAnim);
        mesh.animations.push(rotationAnim);
        scene.beginAnimation(mesh, 0, 100, false);

    }

    function removeBulletFromScene(bullet) {
        removeMeshFromScene(bullet.babylonMesh);
    }

    function onBotRegistrationStarting() {
        var botsInScene = botsCurrentlyInScene.slice();

        botsInScene.forEach(function(bot) {
            removeBotFromScene(bot);
        });
    }

    function refreshHealthBarWidth(bot) {
        bot.healthBarSprite.width = 64 * bot.healthPercentage();
    }

    function addBotsToScene() {

        if (!botMeshes.standardClass || !botMeshes.ninja || !botMeshes.tank) {
            // The bot mesh has not yet been loaded. The meshes will be added when the load is complete
            return;
        }

        for (var i = 0; i < arenaState.bots.length; i++) {

            var bot = arenaState.bots[i];

            var isBotAlreadyAddedToScene = botsCurrentlyInScene.indexOf(bot) >= 0;

            if (isBotAlreadyAddedToScene) {
                return;
            }

            botsCurrentlyInScene.push(bot);

            bot.babylonMesh = cloneBotMeshAndMaterials(i, bot); // Default to standardClass if bot is created before the botClass era. i is passed along just to give the bot mesh a "unique" id

            var botCenterPosition = bot.center();

            bot.babylonMesh.position.x = botCenterPosition.y;
            bot.babylonMesh.position.y = shipYValue;
            bot.babylonMesh.position.z = botCenterPosition.x;

            /*if (bot.babylonMesh.material.subMaterials !== undefined) {
                for (var i in bot.babylonMesh.material.subMaterials) {
                    if (bot.babylonMesh.material.subMaterials[i].name !== undefined && bot.babylonMesh.material.subMaterials[i].name == 'botColor') {
                        bot.babylonMesh.material.subMaterials[i].diffuseColor = new BABYLON.Color3(1, 0, 0);
                    }
                }
            }*/

            bot.babylonMesh.scaling = new BABYLON.Vector3(10, 10, 10);

            bot.healthBarSprite = new BABYLON.Sprite("healthbar_" + i, healthBarSpritesManager);
            bot.healthBarSprite.color = new BABYLON.Color4(0, 1, 0.2, 1);
            bot.healthBarSprite.position.x = botCenterPosition.y;
            bot.healthBarSprite.position.y = healthBarYValue;
            bot.healthBarSprite.position.z = botCenterPosition.x;
            bot.healthBarSprite.size = 45;
            refreshHealthBarWidth(bot);

            var nameImageUrl = gosuArena.url.createAbsoluteWithCacheBusting("/api/botnameimage", { name: bot.name, colorHexCode: bot.color });

            var nameBar = new BABYLON.SpriteManager("bot_" + i + "_name_bar", nameImageUrl, 100, 300, scene);
            nameBarSpritesManagers[i] = nameBar;
            bot.nameBar = new BABYLON.Sprite("namebar_" + i, nameBarSpritesManagers[i]);
            bot.nameBar.position.x = botCenterPosition.y;
            bot.nameBar.position.y = nameTagYValue;
            bot.nameBar.position.z = botCenterPosition.x;
            bot.nameBar.size = 150;

            shadowGenerator.getShadowMap().renderList.push(bot.babylonMesh);
            waterMaterial.reflectionTexture.renderList.push(bot.babylonMesh);
            waterMaterial.refractionTexture.renderList.push(bot.babylonMesh);
        }
    }

    function cloneBotMeshAndMaterials(index, bot) {
        try
        {
            var botClass = bot.class || 'standardClass'; // default to standardClass if no class is set
            var newMesh = botMeshes[botClass].clone("bot" + index);
            newMesh.material = botMeshes[botClass].material.clone();

            if (botMeshes[botClass].material.subMaterials !== undefined) {
                for (var i = 0; i < botMeshes[botClass].material.subMaterials.length; i++) {
                    if (newMesh.material.subMaterials[i]) { // if a submaterial exists
                        if (newMesh.material.subMaterials[i].name.indexOf('botColor') > -1) {
                            // replace with colored material
                            newMesh.material.subMaterials[i] = helpers.babylon.createColoredMaterial(bot.color, "botColor_" + bot.name, scene);
                        } else {
                            // clone existing material
                            newMesh.material.subMaterials[i] = botMeshes[botClass].material.subMaterials[i].clone();
                            newMesh.material.subMaterials[i].name = botMeshes[botClass].material.subMaterials[i].name + botClass + '_' + i;
                        }
                    }
                }
            }
        } catch(e)
        {
            console.log('err: ' +e);
        }

        return newMesh;
    }

    function onGameStarting() {
        addBotsToScene();
    }

    function onMatchEnded() {
        removeAllBullets();
        moveCameraToDefaultGamePosition();
    }

    function removeAllBullets() {
        arenaState.bullets.forEach(function (bullet) {
            removeBulletFromScene(bullet);
        });
    }

    function cameraTargetBot(bot) {
        var bots = arenaState.bots;

        for (var i = 0; i < bots.length; i++) {
            if (bots[i].id === bot.id) {
                scene.activeCamera.target = bots[i].babylonMesh;

                animateArcRotateCamera(Math.PI / 2.5, 300, 100, scene.activeCamera);
            }
        }
    }

    function initialize(worldArenaState) {
        arenaState = worldArenaState;
        arenaState.onBotKilled(onBotKilled);
        arenaState.onBulletHitBot(onBulletHitBot);
        arenaState.onBulletHitTerrain(onBulletRemoved);
        arenaState.onBotHitByBullet(onBotHitByBullet);
        arenaState.onShotFired(onShotFired);
        arenaState.onTick(function () {
            update(arenaState);
        });
        arenaState.onClearStarting(function () {
            removeAllBullets();
        });

        gosuArena.events.botRegistrationStarting(onBotRegistrationStarting);
        gosuArena.events.gameStarting(onGameStarting);
        gosuArena.events.matchEnded(onMatchEnded);
        gosuArena.events.targetCameraOnBot(cameraTargetBot);

        arenaState.onBotAugmentationActivated(function (bot, augmentation) {
            if (augmentation.id === "cloak") {
                turnBotTransparent(bot.id);
            }
        });

        arenaState.onBotAugmentationDeactivated(function (bot, augmentation) {
            if (augmentation.id === "cloak") {
                turnBotSolid(bot.id);
            }
        });

        gosuArena.visualizers.babylonEngine = new BABYLON.Engine(canvas, true);
        engine = gosuArena.visualizers.babylonEngine;

        // This is supposed to disable offline support to avoid Babylon requesting manifest files,
        // but it does not really seem to work. It is still requesting the manifest files.
        engine.enableOfflineSupport = false;

        scene = createScene(canvas);
        setUpLights();

        setUpSounds();

        
        setUpParticleSmoke();
        setUpLandscape(arenaState);
        setUpSkyBox();
       


        // Create a sprite manager
        healthBarSpritesManager = new BABYLON.SpriteManager("healthBarSpritesManager", gosuArena.url.createAbsolute("/Content/images/sprites/healthbar.png"), 100, 64, scene);
        explosionSpriteManager = new BABYLON.SpriteManager("explosions", gosuArena.url.createAbsolute("/Content/images/sprites/explosion17.png"), 50, 64, scene);
        $(window).on("resize", function () {

            var width = window.innerWidth;
            var height = window.innerHeight;
            engine.setSize(width, height);
            engine.resize();
            canvas.width = width;
            canvas.height = height;

        });
        

        loadBotMeshes();

        engine.runRenderLoop(function () {
            scene.render();
        });
    }

    function moveCameraToDefaultGamePosition() {
       // createAndStartAnimation("cameraZoomX", scene.activeCamera, "position.x", false, scene.activeCamera.position.x, 970);
        //createAndStartAnimation("cameraZoomY", scene.activeCamera, "position.y", false, scene.activeCamera.position.y, 400);
        //createAndStartAnimation("cameraZoomZ", scene.activeCamera, "position.z", false, scene.activeCamera.position.z, 400);
        animateArcRotateCamera(Math.PI / 4, 1000, 30, scene.activeCamera);
    }

    function animateArcRotateCamera(toBeta, toRadius, animationSpeed,camera) {

        var animCamBeta = new BABYLON.Animation("animCam", "beta", animationSpeed, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        var keysBeta = [];

        keysBeta.push({
            frame: 0,
            value: camera.beta
        });

        keysBeta.push({
            frame: 100,
            value: toBeta
        });

        var animCamRadius = new BABYLON.Animation("animCam", "radius", animationSpeed, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        var keysRadius = [];

        keysRadius.push({
            frame: 0,
            value: camera.radius
        });

        keysRadius.push({
            frame: 100,
            value: toRadius
        });

        animCamBeta.setKeys(keysBeta);
        animCamRadius.setKeys(keysRadius);
        camera.animations.push(animCamBeta);
        camera.animations.push(animCamRadius);

        scene.beginAnimation(camera, 0, 100, false);

    }




    function createAndStartAnimation(name, obj, property, loop, startValue, endValue) {
        var loopMode = loop ? BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE : BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT;

        var animation = new BABYLON.Animation(name, property, 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, loopMode);

        // An array with all animation keys
        var keys = [];

        //At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: startValue
        });

        //At the animation key 100, the value of scaling is "1"
        keys.push({
            frame: 100,
            value: endValue
        });

        animation.setKeys(keys);

        var easingFunction = new BABYLON.CubicEase();

        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);

        animation.setEasingFunction(easingFunction);

        obj.animations.push(animation);

        scene.beginAnimation(obj, 0, 100);
    }

    function onShotFired(bot, bullet) {
        //canonSound.play();
    }   

    function setUpLandscape(arenaState) {
        BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "iceWorld.babylon", scene, function (newMeshes, particleSystems) {
            landscape = newMeshes[0];
           landscape.convertToFlatShadedMesh();
            landscape.scaling = new BABYLON.Vector3(3000, 3000, 3000);
            landscape.rotation.y = Math.PI;
            landscape.position = new BABYLON.Vector3(-2000, -200, 500);
            
            landscape.receiveShadows = true;
 
            setUpWater(arenaState);

        });
    }

    function setUpSkyBox() {


        skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(gosuArena.url.createAbsolute("/Content/textures/skybox/TropicalSunnyDay"), scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }

    function update(arenaState) {
        updateBots(arenaState);
        updateBullets(arenaState);
    }

    var createScene = function (canvas) {
       
        var newScene = new BABYLON.Scene(engine);

        var toBeta = gosuArena.isTraining ? Math.PI / 4 : Math.PI / 2.5;
        var toRadius = gosuArena.isTraining ? 1000 : 2000;

        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 0, toBeta, toRadius, new BABYLON.Vector3(300, 0, 400), newScene);

        newScene.activeCamera = camera;
        camera.attachControl(canvas, false);
        camera.upperBetaLimit = Math.PI / 2.05;
        camera.lowerRadiusLimit = 10;
        camera.upperRadiusLimit = 2000;
        camera.inertia = 0.7;
        camera.wheelPrecision = 0.03;
        camera.maxZ = 20000;

        // disable navigation by arrow keys 
        camera.keysDown = [];
        camera.keysLeft = [];
        camera.keysRight = [];
        camera.keysUp = [];

        return newScene;
    };

    function setUpSounds() {
        
        waterSound = new BABYLON.Sound("WaterSound", gosuArena.url.createAbsolute("/Content/sounds/water_sound.wav"), scene, null, { loop: true, autoplay: true, volume: 0.01 });
        waterSound.maxDistance = 3000;

        canonSound = new BABYLON.Sound("CanonSound", gosuArena.url.createAbsolute("/Content/sounds/cork.wav"), scene, null, {loop: false, autoplay: false, volume: 0.005});
        canonSound.maxDistance = 7000;
    };


    function setUpLights() {

        sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-10, -2, -1), scene);
        sun.position = new BABYLON.Vector3(1000, 10000, 1000);
        sun.intensity = 2;
        shadowGenerator = new BABYLON.ShadowGenerator(2000, sun);
        shadowGenerator.usePoissonSampling = true;
        
    };
    
   
    function setUpTerrain(arenaState) {

        
        //set up material for the walls
        var brickMaterial = [];
        brickMaterial[0] = new BABYLON.StandardMaterial("bricks", scene);
        brickMaterial[0].diffuseTexture = new BABYLON.Texture(gosuArena.url.createAbsolute("/Content/textures/Brick_Wall_03.jpg"), scene);
        brickMaterial[0].specularColor = new BABYLON.Color3(0, 0, 0);

        brickMaterial[1] = brickMaterial[0].clone();
        brickMaterial[2] = brickMaterial[0].clone();
        brickMaterial[3] = brickMaterial[0].clone();

        for (var i = 0; i < arenaState.terrain.length; i++) {

            var currentTerrain = arenaState.terrain[i];
            var terrainCenter = currentTerrain.center();


            var wallMesh = BABYLON.Mesh.CreateBox("wall_" + i, 1, scene);

            wallMesh.scaling = new BABYLON.Vector3(currentTerrain.width, currentTerrain.height, currentTerrain.height / 2);
            wallMesh.position = new BABYLON.Vector3(terrainCenter.y, 0, terrainCenter.x);


            brickMaterial[i].diffuseTexture.vScale = 0.3;
            brickMaterial[i].diffuseTexture.uScale = 5.0;
            wallMesh.material = brickMaterial[i];

            if (currentTerrain.angle === 0 || currentTerrain.angle === 180) {
                wallMesh.rotation.y = Math.PI / 2;
            }

            waterMaterial.refractionTexture.renderList.push(wallMesh);
            waterMaterial.reflectionTexture.renderList.push(wallMesh);
            shadowGenerator.getShadowMap().renderList.push(wallMesh);
        }
    };       
    
    function setUpWater(arenaState) {

    
        var water = BABYLON.Mesh.CreateGround("water", 10000, 10000, 1, scene, false);
        
        waterMaterial = new gosu.WaterMaterial("water", scene, sun);

        waterMaterial.refractionTexture.renderList.push(landscape);

        waterMaterial.reflectionTexture.renderList.push(skybox);
        waterMaterial.reflectionTexture.renderList.push(landscape);

        water.isPickable = false;
        water.material = waterMaterial;

        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];
            waterMaterial.reflectionTexture.renderList.push(bot.babylonMesh);
        }

        water.receiveShadows = true;
        

        waterSound.attachToMesh(water);
        setUpTerrain(arenaState);
    }

    function loadBotMeshes() {
        BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "standardClass.babylon", scene, function (newMeshes, particleSystems) {
            botMeshes.standardClass = newMeshes[0];
            botMeshes.standardClass.scaling = new BABYLON.Vector3(1, 1, 1);
            addBotsToScene();
        });

        BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "ninja.babylon", scene, function (newMeshes, particleSystems) {
            botMeshes.ninja = newMeshes[0];
            botMeshes.ninja.scaling = new BABYLON.Vector3(1, 1, 1);
            addBotsToScene();
        });

        BABYLON.SceneLoader.ImportMesh("", gosuArena.url.createAbsolute("/Content/models/"), "tank.babylon", scene, function (newMeshes, particleSystems) {
            botMeshes.tank = newMeshes[0];
            botMeshes.tank.scaling = new BABYLON.Vector3(1, 1, 1);
            addBotsToScene();
        });

    }

    function updateBots(arenaState) {
        
        for (var i = 0; i < arenaState.bots.length; i++) {

            var bot = arenaState.bots[i];
            
            if (bot.babylonMesh !== undefined) {

                var botCenterPosition = bot.center();

                bot.babylonMesh.position.x = botCenterPosition.y;
                bot.babylonMesh.position.z = botCenterPosition.x;
                bot.babylonMesh.rotation.y = gosu.math.degreesToRadians(bot.angle + 180); // +180 fixes model facing wrong direction

                bot.healthBarSprite.position.x = botCenterPosition.y;
                bot.healthBarSprite.position.z = botCenterPosition.x;
                
                bot.nameBar.position.x = botCenterPosition.y;
                bot.nameBar.position.z = botCenterPosition.x;
            }
        }
    }

    function turnBotTransparent(botId) {
        var bot = findBotById(botId);

        setBotTransparency(bot.babylonMesh.material, 0.1);
    }

    function turnBotSolid(botId) {
        var bot = findBotById(botId);

        setBotTransparency(bot.babylonMesh.material, 1);
    }

    function findBotById(botId){
        var bots = arenaState.bots;

        for (var i = 0; i < bots.length; i++) {
            if (bots[i].id === botId) {
                return bots[i];
            }
        }
    }

    function setBotTransparency(material, value) {
        if (material.subMaterials !== undefined) {
            for (var j = 0; j < material.subMaterials.length; j++) {
                material.subMaterials[j].alpha = value;
            }
        }
    }

    function onBotHitByBullet(bot) {

        if (bot.healthPercentage() < 0.7) {
            bot.healthBarSprite.color.r = 1;
            bot.healthBarSprite.color.g = bot.healthPercentage();
        }

        refreshHealthBarWidth(bot);

        // explosion

        var botCenterPosition = bot.center();

        var explosion = new BABYLON.Sprite("explosion", explosionSpriteManager);
        explosion.position.x = botCenterPosition.y;
        explosion.position.z = botCenterPosition.x;
        explosion.position.y = explosionYValue;
        explosion.size = 20;
        explosion.disposeWhenFinishedAnimating = true;
        explosion.layerMask = 255;
        explosion.playAnimation(0, 24, false, 16);
    }

    function onBulletRemoved(bullet) {
        removeBulletFromScene(bullet);
    }

    function onBulletHitBot(bullet) {
        removeBulletFromScene(bullet);
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

                bullet.babylonMesh = BABYLON.Mesh.CreateSphere("bullet", 4.0, 4.0 * (bullet.damage * 0.1), scene);
                bullet.babylonMesh.color = new BABYLON.Color3.Red();
                var bulletMaterial = new BABYLON.StandardMaterial("bMat", scene);
                bulletMaterial.diffuseColor = new BABYLON.Color3.Red();
                bullet.babylonMesh.material = bulletMaterial;
                
                //bullet.babylonMesh.material = materials.bullet; // this grey appears completely white. Why?
                bullet.babylonMesh.position.y = bulletYValue;
                shadowGenerator.getShadowMap().renderList.push(bullet.babylonMesh);
                var smoke = particleSmoke.clone();
                smoke.emitter = bullet.babylonMesh;
                smoke.start();
            }

            var bulletCenterPosition = bullet.center();


            bullet.babylonMesh.position.x = bulletCenterPosition.y;
            bullet.babylonMesh.position.z = bulletCenterPosition.x;
        }
    }

    function onBotKilled(bot) {
        removeBotFromScene(bot);
    }

    function setUpParticleSmoke() {

        particleSmoke = new BABYLON.ParticleSystem("smoke", 4000, scene);

        //Texture of each particle
        particleSmoke.particleTexture = new BABYLON.Texture(gosuArena.url.createAbsolute("/Content/images/sprites/flare_red.jpg"), scene);


        particleSmoke.minEmitBox = new BABYLON.Vector3(-1, -1, -1); // Starting all from
        particleSmoke.maxEmitBox = new BABYLON.Vector3(1, 1, 1); // To...

        // Colors of all particles
        //particleSmoke.color1 = new BABYLON.Color4.FromInts(138, 49, 21, 255);
        //particleSmoke.color2 = new BABYLON.Color4.FromInts(138, 123, 21, 255);
        particleSmoke.color1 = new BABYLON.Color4.FromInts(138, 49, 21, 255);
        particleSmoke.color2 = new BABYLON.Color4.FromInts(66, 66, 66, 255);
        particleSmoke.colorDead = new BABYLON.Color4(0, 0, 0, 0);

        // Size of each particle (random between...
        particleSmoke.minSize = 1;
        particleSmoke.maxSize = 2;

        // Life time of each particle (random between...
        particleSmoke.minLifeTime = 0.1;
        particleSmoke.maxLifeTime = 0.2;

        // Emission rate
        particleSmoke.emitRate = 4000;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSmoke.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSmoke.gravity = new BABYLON.Vector3(0, 100, 0);

        // Direction of each particle after it has been emitted
        particleSmoke.direction1 = new BABYLON.Vector3(-1, 0.5, 1);
        particleSmoke.direction2 = new BABYLON.Vector3(1, -0.5, 1);

        // Angular speed, in radians
        particleSmoke.minAngularSpeed = 0;
        particleSmoke.maxAngularSpeed = Math.PI;

        // Speed
        particleSmoke.minEmitPower = 20;
        particleSmoke.maxEmitPower = 40;
        particleSmoke.updateSpeed = 0.010;

    }

    return {
        initialize: initialize,
        moveCameraToDefaultGamePosition: moveCameraToDefaultGamePosition,
        cameraTargetBot: cameraTargetBot
    };
}