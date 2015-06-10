﻿var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizer3D = function (canvas) {
    // Constants
    var WIDTH = 1024;
    var HEIGHT = 768;
    var CAMERA_MOVE_SPEED = 5;
    var CAMERA_ROTATION_SPEED = 1;
    var SCALE = 100;
    var MODEL_SCALE = 30.0;
    var MODEL_Y = 5.0;
    // 60 fps
    var FAKE_DT = 0.16;

    // Key codes
    var UP = 87;
    var LEFT = 65;
    var DOWN = 83;
    var RIGHT = 68;
    var R_UP = 81;
    var R_DOWN = 69;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(WIDTH, HEIGHT);

    var scene = null;
    var camera = null;
    var wallObjects = [];
    var cube = null;
    var plane = null;
    var tankModel = null;
    var landscape = null;
    var controls = null;

    function createScene(arenaState) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 1000);

        var loader1 = new THREE.AssimpJSONLoader();
        loader1.load('Content/models/jeep.assimp.json', function (object) {
        
            //object.scale.multiplyScalar(1);
            tankModel = object;
            addBotModels(arenaState);
        });

        camera.position.x = 0;

        //camera.position.y = 135;
        //camera.position.z = 80;
        //camera.rotation.x = gosu.math.degreesToRadians(-67);
        
        camera.position.y = 200;
        camera.position.z = 200;
        camera.rotation.x = gosu.math.degreesToRadians(-40);

         //Top down camera
        //camera.position.x = 0;
        //camera.position.y = 150;
        //camera.position.z = 0;
        //camera.rotation.x = gosu.math.degreesToRadians(-90);

        //addPlane();
        addLandscape();
        addTerrain(arenaState);
        
        addLights();

        //addEventListeners();

        controls = new THREE.FlyControls(camera);

        controls.movementSpeed = 0.0005;
        controls.domElement = document.getElementById("3d-game-canvas");
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = true;
    }

    function renderBullets(arenaState) {
        for (var i = 0; i < arenaState.bullets.length; i++) {
            var bullet = arenaState.bullets[i];
        
            if (!bullet.mesh) {
                var sphereGeometry = new THREE.SphereGeometry(2, 10, 10);

                var sphereMaterial = new THREE.MeshPhongMaterial({
                    color: 0xffffcc,
                    shininess: 30,
                    metal: true
                })

                bullet.mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
                scene.add(bullet.mesh);
            }

            setMeshRotation(bullet);
            setMeshPosition(bullet, 5);
        }
    }

    function addPlane() {
        var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x6F553A });
        planeMaterial.side = THREE.DoubleSide;
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = gosu.math.degreesToRadians(90);

        scene.add(plane);
    }

    function addLandscape() {
        var loader = new THREE.ColladaLoader();
        loader.load('Content/models/mountain_landscape_with_background.dae', function (collada) {
            
            landscape = collada.scene;
            landscape.rotation.set(-Math.PI * 0.5, 0, 0);
            landscape.scale.x = landscape.scale.y = landscape.scale.z = 40;
            scene.add(landscape);
        });
    }

    function addTerrain(arenaState) {
        function renderWallEndBox(vec3, rotation) {
            var boxGeometry = new THREE.BoxGeometry(15, 16, 15, 1, 1, 1);
            var boxMaterial = new THREE.MeshPhongMaterial({
                color: 0xe1e6e8,
                shininess: 20,
                metal: true
            })

            var mesh = new THREE.Mesh(boxGeometry, boxMaterial);

            if (rotation) {
                mesh.rotation.y = gosu.math.degreesToRadians(rotation);
            }

            mesh.position.set(vec3.x, vec3.y + 8, vec3.z);

            scene.add(mesh);
        }

        function renderWallBox(vec3, rotation) {
            var boxGeometry = new THREE.BoxGeometry(200, 10, 8, 1, 1, 1);
            var boxMaterial = new THREE.MeshPhongMaterial({
                shininess: 20,
                metal: true
            })

            var mesh = new THREE.Mesh(boxGeometry, boxMaterial);

            if (rotation) {
                mesh.rotation.y = gosu.math.degreesToRadians(rotation);
            }

            mesh.position.set(vec3.x, vec3.y + 5, vec3.z);

            scene.add(mesh);

            wallObjects.push(mesh);
        }

        var topLeft = gosu.math.createVector(-25, -25);
        var topRight = gosu.math.createVector(1049, -25);
        var bottomLeft = gosu.math.createVector(-25, 743);
        var bottomRight = gosu.math.createVector(1049, 743);
        var centerTop = gosu.math.createVector(512, -25);
        var centerLeft = gosu.math.createVector(-25, 384);
        var centerRight = gosu.math.createVector(1049, 384);
        var centerBottom = gosu.math.createVector(512, 743);

        var tl = toCartesianCoordinates(topLeft);
        var tr = toCartesianCoordinates(topRight);
        var bl = toCartesianCoordinates(bottomLeft);
        var br = toCartesianCoordinates(bottomRight);
        
        var ct = toCartesianCoordinates(centerTop);
        var cl = toCartesianCoordinates(centerLeft);
        var cr = toCartesianCoordinates(centerRight);
        var cb = toCartesianCoordinates(centerBottom);

        renderWallEndBox(tl);
        renderWallEndBox(tr);
        renderWallEndBox(bl);
        renderWallEndBox(br);

        renderWallBox(ct, 0);
        renderWallBox(cl, -90);
        renderWallBox(cr, -90);
        renderWallBox(cb, 0);

    }

    function addLights() {
        var ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        addDirectionalLight(wallObjects[0]);
        addDirectionalLight(wallObjects[1]);
        addDirectionalLight(wallObjects[2]);
        addDirectionalLight(wallObjects[3]);
    }

    function addDirectionalLight(target) {
        var directionalLight = new THREE.DirectionalLight(0x404040, 0.8);

        directionalLight.position.x = 0;
        directionalLight.position.y = 200;
        directionalLight.position.z = 0;

        directionalLight.target = target;

        scene.add(directionalLight);
    }

    function addPointLight(x, y, z) {
        var light = new THREE.PointLight(0xffffff, 0.8, 0);
        light.position.set(x, y, z);
        scene.add(light);
    }

    function addBots(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
            var boxMaterial = new THREE.MeshPhongMaterial({
                shininess: 30,
                metal: true
            })

            bot.mesh = new THREE.Mesh(boxGeometry, boxMaterial);
            setMeshRotation(bot);
            setMeshPosition(bot, 5);

            scene.add(bot.mesh);
        }
    }

    function addBotModels(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
            var boxMaterial = new THREE.MeshPhongMaterial({
                shininess: 30,
                metal: true
            })

            bot.mesh = tankModel.clone();
            // TODO(Jocke): Fix this!
            setMeshRotation(bot, 180);
            setMeshPosition(bot, 5);

            scene.add(bot.mesh);
        }
    }

    function updateBots(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            if (!bot.isAlive()) {
                removeObjectFromScene(bot);
            }

            // TODO(Jocke): Fix this!
            setMeshRotation(bot, 180);
            setMeshPosition(bot);
        }
    }

    function setMeshRotation(bot, additionalRotation) {
        if (!bot.mesh)
            return;

        var angle = -bot.angle + additionalRotation || 0;
        bot.mesh.rotation.y = gosu.math.degreesToRadians(angle);
    }

    function setMeshPosition(bot, y) {
        if (!bot.mesh)
            return;

        y = y || bot.mesh.position.y;
        var position = toCartesianCoordinates(bot.center(), 100);

        bot.mesh.position.set(position.x, y, position.z);
    }

    function render(arenaState) {
        updateBots(arenaState);
        renderBullets(arenaState);

        controls.update(FAKE_DT);

        renderer.render(scene, camera);
    }

    function removeObjectFromScene(object) {
        if (object && object.mesh) {
            scene.remove(object.mesh);
        }
    }

    function onKeyDown(e) {

        if (e.keyCode == UP) {
            camera.position.y += CAMERA_MOVE_SPEED;
        }

        if (e.keyCode == DOWN) {
            camera.position.y -= CAMERA_MOVE_SPEED;
        }

        if (e.keyCode == LEFT) {
            camera.position.x -= CAMERA_MOVE_SPEED;
        }

        if (e.keyCode == RIGHT) {
            camera.position.x += CAMERA_MOVE_SPEED;
        }

        if (e.keyCode == R_UP) {
            camera.rotation.x += gosu.math.degreesToRadians(CAMERA_ROTATION_SPEED);
        }

        if (e.keyCode == R_DOWN) {
            camera.rotation.x -= gosu.math.degreesToRadians(CAMERA_ROTATION_SPEED);sw
        }
    }

    function toCartesianCoordinates(vec2D) {
        var x = (vec2D.x / WIDTH) * 2 - 1;
        var z = -(vec2D.y / HEIGHT) * 2 + 1;

        return new THREE.Vector3(x * SCALE, 0, -z * SCALE);
    }

    return {
        createScene: createScene,
        removeObjectFromScene : removeObjectFromScene,
        render: render
    };
};
