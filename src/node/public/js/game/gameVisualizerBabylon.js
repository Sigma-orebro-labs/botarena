var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizerBabylon = function (canvas) {


    var scene;
    var engine;
    var sun;
    var canonSound;
    var waterSound;
    var particleExplosion;
    var particleSmoke;

    var shipAndBulletYvalue = 10;
    var skybox;

    function initialize(arenaState) {

        console.log(arenaState);
        arenaState.onBotKilled(onBotKilled);
        arenaState.onBulletHitBot(onBulletHitBot);
        arenaState.onBulletHitTerrain(onBulletRemoved);
        arenaState.onShotFired(onShotFired);
        arenaState.onBotHitByBullet(raiseOnBotHitByBullet);
        arenaState.onTick(function() {
            update(arenaState);
        });

        BABYLON.Engine.ShadersRepository = "../js/Shaders/"

        engine = new BABYLON.Engine(canvas, true);

        scene = createScene(canvas);
        setUpLights();

        setUpSounds();

        assignBotModels(arenaState);
        setUpTerrain(arenaState);
        setUpParticleSmoke();
        setUpParticleExplosion();
        setUpSkyBox();
        setUpWater(arenaState);
        
        

        engine.runRenderLoop(function () {

            scene.render();
        });
        
    }

    function onShotFired(bot, bullet) {
        canonSound.play();
    }
    
    function onBulletHitBot(bullet) {
        
        var explosion = particleExplosion.clone();
        
        
        if(bullet.angle <= 90){
            
            explosion.emitter = new BABYLON.Vector3(bullet.y - 12, shipAndBulletYvalue, bullet.x - 12);
            
        } else if(bullet.angle <= 180 && bullet.angle > 90){
            
            explosion.emitter = new BABYLON.Vector3(bullet.y + 12, shipAndBulletYvalue, bullet.x - 12);
            
        } else if(bullet.angle <= 270 && bullet.angle > 180 ) {
            
            explosion.emitter = new BABYLON.Vector3(bullet.y + 12, shipAndBulletYvalue, bullet.x + 12);
            
        } else {
            
            explosion.emitter = new BABYLON.Vector3(bullet.y - 12, shipAndBulletYvalue, bullet.x + 12);
            
        }
        
        
        var offsetAngle1 = gosu.math.degreesToRadians(bullet.angle + 20) + Math.PI / 2;
        var offsetAngle2 = gosu.math.degreesToRadians(bullet.angle - 20) + Math.PI / 2;
        
        var vector1 = new BABYLON.Vector3(Math.sin(offsetAngle1) * 3, 1, Math.cos(offsetAngle1) * 3);
        var vector2 = new BABYLON.Vector3(Math.sin(offsetAngle2) * 3, -1, Math.cos(offsetAngle2) * 3);
        
        console.log("vector1: " + vector1 + "       vector2: " + vector2);
       
        
        explosion.direction1 = vector1;
        explosion.direction2 = vector2;     

        
        explosion.start();
        
        removeMeshFromScene(bullet.babylonMesh);
        
    }
    
    function setUpParticleExplosion() {
        
        particleExplosion = new BABYLON.ParticleSystem("explosion", 3000, scene);    
        

        //Texture of each particle
        particleExplosion.particleTexture = new BABYLON.Texture("assets/images/Flare.jpg", scene);
       
        
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
        particleSmoke.particleTexture = new BABYLON.Texture("assets/images/Flare.jpg", scene);
       
        
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
    

    function setUpSkyBox() {

        skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/", scene);
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
        
        waterSound = new BABYLON.Sound("WaterSound", "assets/sounds/water_sound.wav", scene, null, { loop: true, autoplay: true, volume: 0.3 });
        waterSound.maxDistance = 3000;

        canonSound = new BABYLON.Sound("CanonSound", "assets/sounds/cork.wav", scene, null, {loop: false, autoplay: false, volume: 0.05});
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
        brickMaterial = [];
        brickMaterial[0]= new BABYLON.StandardMaterial("bricks", scene);
        brickMaterial[0].diffuseTexture = new BABYLON.Texture("assets/textures/Brick_Wall_03.jpg", scene);
        brickMaterial[0].specularColor = new BABYLON.Color3(0, 0, 0);
        
        brickMaterial[1] = brickMaterial[0].clone();
        brickMaterial[2] = brickMaterial[0].clone();
        brickMaterial[3] = brickMaterial[0].clone();
        
        
        
        for( var i = 0; i < arenaState.terrain.length; i++) {
            
            var currentTerrain = arenaState.terrain[i];
            var terrainCenter = currentTerrain.center();
            
            
            var wallMesh = BABYLON.Mesh.CreateBox("wall_" + i, 1, scene);
            
            wallMesh.scaling = new BABYLON.Vector3(currentTerrain.width, currentTerrain.height, currentTerrain.height / 2);
            wallMesh.position = new BABYLON.Vector3(terrainCenter.y, shipAndBulletYvalue, terrainCenter.x);
            
            
            brickMaterial[i].diffuseTexture.vScale = 0.3;
            brickMaterial[i].diffuseTexture.uScale = 5.0;
            wallMesh.material = brickMaterial[i];
            
            if( currentTerrain.angle === 0 || currentTerrain.angle === 180) {
                wallMesh.rotation.y = Math.PI / 2;   
            }
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


        BABYLON.SceneLoader.ImportMesh("", "assets/models/", "ship.babylon", scene, function (newMeshes, particleSystems) {

            var mesh = newMeshes[1];
            //mesh.convertToFlatShadedMesh();

            for (var i = 0; i < arenaState.bots.length; i++) {

                var bot = arenaState.bots[i];


                bot.babylonMesh = mesh.createInstance("bot" + i);


                bot.babylonMesh.position.x = bot.y;
                bot.babylonMesh.position.y = shipAndBulletYvalue;
                bot.babylonMesh.position.z = bot.x;

                bot.babylonMesh.scaling = new BABYLON.Vector3(10, 10, 10);
                
                
                var healthBarMaterial = new BABYLON.StandardMaterial("healthBarMaterial" + i, scene);
                healthBarMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
                
                bot.healthBarMesh = new BABYLON.Mesh.CreateBox("bot_" + i + "_health_bar", 10.0, scene);
                bot.healthBarMesh.scaling = new BABYLON.Vector3(0.7, 0.7, 5);
                bot.healthBarMesh.originalWidth = 50;
                
                bot.healthBarMesh.material = healthBarMaterial;
                
                bot.healthBarMesh.position.x = bot.y;
                bot.healthBarMesh.position.y = shipAndBulletYvalue * 4;
                bot.healthBarMesh.position.z = bot.x;
                bot.healthBarMesh.rotation.y = Math.PI + gosu.math.degreesToRadians(bot.angle);


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
                
                bot.healthBarMesh.position.x = bot.y;
                bot.healthBarMesh.position.z = bot.x;
                bot.healthBarMesh.rotation.y = Math.PI + gosu.math.degreesToRadians(bot.angle);
            }
        }
    }

    // a function to fake a sunset
    function updateSunLight() {
        sun.direction.x -= 0.01;
        sun.direction.y += 0.01;
    }
    
    function raiseOnBotHitByBullet (bot) {
        
       var size = bot.healthBarMesh.originalWidth;
       bot.healthBarMesh.scaling.z = 5 * bot.healthPercentage();
       bot.healthBarMesh.material.diffuseColor.r = 1 - bot.healthPercentage();
       bot.healthBarMesh.material.diffuseColor.g = bot.healthPercentage();
       
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
                
                var smoke = particleSmoke.clone();
                smoke.emitter = bullet.babylonMesh;
                smoke.start();
            }

            bullet.babylonMesh.position.x = bullet.y;
            bullet.babylonMesh.position.z = bullet.x;
        }
    }

    function onBotKilled(bot) {

        bot.healthBarMesh.dispose();
        bot.babylonMesh.dispose();

    }

    return {
        initialize: initialize
    };
}