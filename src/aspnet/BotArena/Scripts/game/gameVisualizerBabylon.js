var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizerBabylon = function (canvas) {


    var scene;
    var engine;
    var sun;
    var canonSound;
    var waterSound;
    var waterMaterial;
    var shipAndBulletYvalue = 10;
    var skybox;
    var landscape;
    var shadowGenerator;
    var ground;
    var healthBarSpritesManager;
    var nameBarSpritesManagers = [];
    var explosionSpriteManager;

    var particleExplosion;
    var particleSmoke;

    function initialize(arenaState) {

        console.log(arenaState);
        arenaState.onBotKilled(onBotKilled);
        arenaState.onBulletHitBot(onBulletHitBot);
        arenaState.onBulletHitTerrain(onBulletRemoved);
        arenaState.onBotHitByBullet(onBotHitByBullet);
        arenaState.onShotFired(onShotFired);
        arenaState.onTick(function () {
            update(arenaState);
        });
        arenaState.onClear(function () {
            // clear
        });

        engine = new BABYLON.Engine(canvas, true);

        scene = createScene(canvas);
        setUpLights();

        setUpSounds();

        assignBotModels(arenaState);
        setUpTerrain(arenaState);
        setUpParticleSmoke();
        setUpParticleExplosion();
        setUpLandscape(arenaState);
        setUpSkyBox();

        // Create a sprite manager
        healthBarSpritesManager = new BABYLON.SpriteManager("healthBarSpritesManager", "/Content/images/sprites/healthbar.png", 100, 64, scene);
        explosionSpriteManager = new BABYLON.SpriteManager("explosions", "/Content/images/sprites/explosion17.png", 50, 64, scene);


        engine.runRenderLoop(function () {
            scene.render();
        });

    }

    function onShotFired(bot, bullet) {
        //canonSound.play();

    }   

    function setUpLandscape(arenaState) {
        BABYLON.SceneLoader.ImportMesh("", "/Content/models/", "only_plane.babylon", scene, function(newMeshes, particleSystems) {
            landscape = newMeshes[0];
            landscape.convertToFlatShadedMesh();
            landscape.scaling = new BABYLON.Vector3(100, 100, 100);
            landscape.position.y = -50;
            landscape.receiveShadows = true;
 
            setUpWater(arenaState);

        });
    }

    function setUpSkyBox() {


        skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/Content/textures/skybox/TropicalSunnyDay", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }

    function update(arenaState) {
        updateBots(arenaState);
       // updateSunLight();
       // skybox.rotation.y -= 0.0001 * scene.getAnimationRatio();
        updateBullets(arenaState);
    }

    var createScene = function (canvas) {
       
        var newScene = new BABYLON.Scene(engine);

        newScene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
        newScene.fogDensity = 0.00015;
        //newScene.fogColor = new BABYLON.Color3(0.8, 0.83, 0.8);
        newScene.fogColor = new BABYLON.Color3(1, 1, 1);

        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(1500, 650, 400), newScene);
        newScene.activeCamera = camera;
        camera.attachControl(canvas, false);
        camera.rotation = new BABYLON.Vector3(Math.PI / 7, -Math.PI / 2, 0);
        camera.rotation.z = -Math.PI / 4;
        camera.speed = 40;        
        
        

        // create a line for each axis, just for orientation aid. 
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

    function setUpSounds() {
        
        waterSound = new BABYLON.Sound("WaterSound", "/Content/sounds/water_sound.wav", scene, null, { loop: true, autoplay: true, volume: 0.01 });
        waterSound.maxDistance = 3000;

        canonSound = new BABYLON.Sound("CanonSound", "/Content/sounds/cork.wav", scene, null, {loop: false, autoplay: false, volume: 0.005});
        canonSound.maxDistance = 7000;
    };


    function setUpLights() {

       // sun = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(-1000, 1000, 0.1), scene);

       // var sun2 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(2000, 4000, -8000), scene);
      //  var sun3 = new BABYLON.PointLight("Omni2", new BABYLON.Vector3(-2000, 4000, -8000), scene);
        

        sun = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-1, -2, -1), scene);
        sun.position = new BABYLON.Vector3(1000, 10000, 1000);
        sun.intensity = 2;
        shadowGenerator = new BABYLON.ShadowGenerator(2000, sun);
        shadowGenerator.usePoissonSampling = true;
        
    };
    
   
    function setUpTerrain(arenaState) {

        
        //set up material for the walls
        var brickMaterial = [];
        brickMaterial[0] = new BABYLON.StandardMaterial("bricks", scene);
        brickMaterial[0].diffuseTexture = new BABYLON.Texture("/Content/textures/Brick_Wall_03.jpg", scene);
        brickMaterial[0].specularColor = new BABYLON.Color3(0, 0, 0);

        brickMaterial[1] = brickMaterial[0].clone();
        brickMaterial[2] = brickMaterial[0].clone();
        brickMaterial[3] = brickMaterial[0].clone();

        

        //var box = new BABYLON.Mesh.CreateBox("testbox", 100, scene);
        //box.material = new BABYLON.StandardMaterial("1", scene);
        //box.position = new BABYLON.Vector3(-1000, 250, 0);
        //box.receiveShadows = true;
        


        //var box2 = new BABYLON.Mesh.CreateBox("testbox2", 100, scene);
        //box2.scaling = new BABYLON.Vector3(10, 0.1, 10);
        //box2.position = new BABYLON.Vector3(-1000, 150, 0);
        //box2.material = new BABYLON.StandardMaterial("2", scene);
        //box2.receiveShadows = true;

        
        //shadowGenerator.getShadowMap().renderList.push(box);
        //shadowGenerator.getShadowMap().renderList.push(box2);

        for (var i = 0; i < arenaState.terrain.length; i++) {

            var currentTerrain = arenaState.terrain[i];
            var terrainCenter = currentTerrain.center();


            var wallMesh = BABYLON.Mesh.CreateBox("wall_" + i, 1, scene);

            wallMesh.scaling = new BABYLON.Vector3(currentTerrain.width, currentTerrain.height, currentTerrain.height / 2);
            wallMesh.position = new BABYLON.Vector3(terrainCenter.y, shipAndBulletYvalue, terrainCenter.x);


            brickMaterial[i].diffuseTexture.vScale = 0.3;
            brickMaterial[i].diffuseTexture.uScale = 5.0;
            wallMesh.material = brickMaterial[i];

            if (currentTerrain.angle === 0 || currentTerrain.angle === 180) {
                wallMesh.rotation.y = Math.PI / 2;
            }
  
            
            shadowGenerator.getShadowMap().renderList.push(wallMesh);
        }
        
    };       
    


    function setUpWater(arenaState) {

        ground = BABYLON.Mesh.CreateGround("ground", 10000, 10000, 1, scene);
        ground.material = new BABYLON.StandardMaterial("ground", scene);
        ground.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
        ground.material.specularColor = BABYLON.Color3.Black();
        ground.receiveShadows = true;
    
        var water = BABYLON.Mesh.CreateGround("water", 10000, 10000, 1, scene, false);
        
        waterMaterial = new gosu.WaterMaterial("water", scene, sun);

        
        waterMaterial.refractionTexture.renderList.push(ground);
        waterMaterial.refractionTexture.renderList.push(landscape);

        waterMaterial.reflectionTexture.renderList.push(ground);
        waterMaterial.reflectionTexture.renderList.push(skybox);
        waterMaterial.reflectionTexture.renderList.push(landscape);

        water.isPickable = false;
        water.material = waterMaterial;

        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];
            waterMaterial.reflectionTexture.renderList.push(bot.babylonMesh);
            waterMaterial.reflectionTexture.renderList.push(bot.healthBarMesh);
        }


        

        waterSound.attachToMesh(water);
    }

    function assignBotModels(arenaState) {


        BABYLON.SceneLoader.ImportMesh("", "/Content/models/", "ship.babylon", scene, function (newMeshes, particleSystems) {

            var mesh = newMeshes[1];
            //mesh.convertToFlatShadedMesh();

            for (var i = 0; i < arenaState.bots.length; i++) {

                var bot = arenaState.bots[i];

                bot.babylonMesh = mesh.createInstance("bot" + i);


                bot.babylonMesh.position.x = bot.y;
                bot.babylonMesh.position.y = shipAndBulletYvalue;
                bot.babylonMesh.position.z = bot.x;

                bot.babylonMesh.scaling = new BABYLON.Vector3(10, 10, 10);

                /*var healthBarMaterial = new BABYLON.StandardMaterial("healthBarMaterial" + i, scene);
                healthBarMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
                healthBarMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
                
                bot.healthBarMesh = new BABYLON.Mesh.CreateBox("bot_" + i + "_health_bar", 10.0, scene);
                bot.healthBarMesh.scaling = new BABYLON.Vector3(0.7, 0.7, 5);
                bot.healthBarMesh.originalScaling = 5;
                
                bot.healthBarMesh.material = healthBarMaterial;
                
                bot.healthBarMesh.position.x = bot.y;
                bot.healthBarMesh.position.y = shipAndBulletYvalue * 4;
                bot.healthBarMesh.position.z = bot.x;
                bot.healthBarMesh.rotation.y = Math.PI + gosu.math.degreesToRadians(bot.angle);*/

                bot.healthBarSprite = new BABYLON.Sprite("healthbar_" + i, healthBarSpritesManager);
                bot.healthBarSprite.color = new BABYLON.Color4(0, 1, 0.2, 1);
                bot.healthBarSprite.position.x = bot.y;
                bot.healthBarSprite.position.y = shipAndBulletYvalue * 4;
                bot.healthBarSprite.position.z = bot.x;
                bot.healthBarSprite.size = 45;
 
                var nameBar = new BABYLON.SpriteManager("bot_" + i + "_name_bar", "/Content/images/sprites/dummyname.png", 100, 144, scene);
                nameBarSpritesManagers[i] = nameBar;
                bot.nameBar = new BABYLON.Sprite("namebar_" + i, nameBarSpritesManagers[i]);
                bot.nameBar.position.x = bot.y;
                bot.nameBar.position.y = shipAndBulletYvalue * 4;
                bot.nameBar.position.z = bot.x;
                bot.nameBar.size = 85;

                shadowGenerator.getShadowMap().renderList.push(bot.babylonMesh);

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

                /*bot.healthBarMesh.position.x = bot.y;
                bot.healthBarMesh.position.z = bot.x;
                bot.healthBarMesh.rotation.y = Math.PI + gosu.math.degreesToRadians(bot.angle);*/

                bot.healthBarSprite.position.x = bot.y;
                bot.healthBarSprite.position.z = bot.x;
                
                bot.nameBar.position.x = bot.y;
                bot.nameBar.position.z = bot.x;

            }
        }
    }

    function onBotHitByBullet(bot) {

        /*bot.healthBarMesh.scaling.z = bot.healthBarMesh.originalScaling * bot.healthPercentage();
        bot.healthBarMesh.material.diffuseColor.r = 1 - bot.healthPercentage();
        bot.healthBarMesh.material.diffuseColor.g = bot.healthPercentage();*/

        if (bot.healthPercentage() < 0.7) {
            bot.healthBarSprite.color.r = 1;
            bot.healthBarSprite.color.g = bot.healthPercentage();
        }
        bot.healthBarSprite.width = 64 * bot.healthPercentage();


        // explosion
        var explosion = new BABYLON.Sprite("explosion", explosionSpriteManager);
        explosion.position.x = bot.y;
        explosion.position.z = bot.x;
        explosion.position.y = shipAndBulletYvalue * 2;
        explosion.size = 20;
        explosion.disposeWhenFinishedAnimating = true;
        explosion.layerMask = 255;
        explosion.playAnimation(0, 24, false, 8);
    }

    // a function to fake a sunset
    function updateSunLight() {
        sun.direction.x -= 0.01;
        sun.direction.y += 0.01;
    }

    function onBulletRemoved(bullet) {

        removeMeshFromScene(bullet.babylonMesh);
    }

    function onBulletHitBot(bullet) {
        
        var explosion = particleExplosion.clone();

        explosion.emitter = new BABYLON.Vector3(bullet.y, shipAndBulletYvalue, bullet.x);


        var offsetAngle1 = gosu.math.degreesToRadians(bullet.angle + 20) + Math.PI / 2;
        var offsetAngle2 = gosu.math.degreesToRadians(bullet.angle - 20) + Math.PI / 2;

        var vector1 = new BABYLON.Vector3(Math.sin(offsetAngle1) * 3, 1, Math.cos(offsetAngle1) * 3);
        var vector2 = new BABYLON.Vector3(Math.sin(offsetAngle2) * 3, -1, Math.cos(offsetAngle2) * 3);


        explosion.direction1 = vector1;
        explosion.direction2 = vector2;

        explosion.start();
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
                shadowGenerator.getShadowMap().renderList.push(bullet.babylonMesh);
                var smoke = particleSmoke.clone();
                smoke.emitter = bullet.babylonMesh;
                smoke.start();
            }

            bullet.babylonMesh.position.x = bullet.y;
            bullet.babylonMesh.position.z = bullet.x;
        }
    }

    function onBotKilled(bot) {

        waterMaterial.reflectionTexture.renderList.pop(bot.babylonMesh);
        waterMaterial.reflectionTexture.renderList.pop(bot.healthBarMesh);

        //bot.healthBarMesh.dispose();
        bot.healthBarSprite.dispose();
        bot.nameBar.dispose();
        bot.babylonMesh.dispose();
        shadowGenerator.getShadowMap().renderList.pop(bot.babylonMesh);

    }

    function setUpParticleExplosion() {

        particleExplosion = new BABYLON.ParticleSystem("explosion", 3000, scene);


        //Texture of each particle
        particleExplosion.particleTexture = new BABYLON.Texture("/Content/images/sprites/Flare.jpg", scene);


        // Where the particles come from
        //particleExplosion.emitter = fountain; // the starting object, the emitter
        particleExplosion.minEmitBox = new BABYLON.Vector3(-1, -1, -1); // Starting all from
        particleExplosion.maxEmitBox = new BABYLON.Vector3(1, 1, 1); // To...

        // Colors of all particles
        particleExplosion.color1 = new BABYLON.Color4(1, 1, 0, 1.0);
        particleExplosion.color2 = new BABYLON.Color4(1, 0, 0, 1.0);
        particleExplosion.colorDead = new BABYLON.Color4(0.5, 0, 0, 0.0);

        // Size of each particle (random between...
        particleExplosion.minSize = 0.5;
        particleExplosion.maxSize = 1;

        // Life time of each particle (random between...
        particleExplosion.minLifeTime = 0.2;
        particleExplosion.maxLifeTime = 0.5;

        // Emission rate
        particleExplosion.emitRate = 5000;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleExplosion.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleExplosion.gravity = new BABYLON.Vector3(0, -100, 0);

        // Direction of each particle after it has been emitted
        particleExplosion.direction1 = new BABYLON.Vector3(-1, 0.5, 1);
        particleExplosion.direction2 = new BABYLON.Vector3(1, -0.5, 1);

        // Angular speed, in radians
        particleExplosion.minAngularSpeed = 0;
        particleExplosion.maxAngularSpeed = Math.PI;

        particleExplosion.targetStopDuration = 1;
        particleExplosion.disposeOnStop = true;

        // Speed
        particleExplosion.minEmitPower = 40;
        particleExplosion.maxEmitPower = 60;
        particleExplosion.updateSpeed = 0.05;
    }

    function setUpParticleSmoke() {

        particleSmoke = new BABYLON.ParticleSystem("smoke", 4000, scene);

        //Texture of each particle
        particleSmoke.particleTexture = new BABYLON.Texture("/Content/images/sprites/Flare.jpg", scene);


        particleSmoke.minEmitBox = new BABYLON.Vector3(-1, -1, -1); // Starting all from
        particleSmoke.maxEmitBox = new BABYLON.Vector3(1, 1, 1); // To...

        // Colors of all particles
        particleSmoke.color1 = new BABYLON.Color4.FromInts(100, 100, 100, 255);
        particleSmoke.color2 = new BABYLON.Color4.FromInts(50, 50, 50, 255);
        particleSmoke.colorDead = new BABYLON.Color4(0, 0, 0, 0);

        // Size of each particle (random between...
        particleSmoke.minSize = 2;
        particleSmoke.maxSize = 3;

        // Life time of each particle (random between...
        particleSmoke.minLifeTime = 1;
        particleSmoke.maxLifeTime = 2;

        // Emission rate
        particleSmoke.emitRate = 5000;

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
        particleSmoke.minEmitPower = 2;
        particleSmoke.maxEmitPower = 4;
        particleSmoke.updateSpeed = 0.001;

    }

    return {
        initialize: initialize
    };
}