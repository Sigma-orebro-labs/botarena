var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizer3D = function (canvas) {
    // Constants
    var WIDTH = 1024;
    var HEIGHT = 768;
    var SCALE = 100;

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

    function initialize(arenaState) {

        arenaState.onBotKilled(onBotKilled);
        arenaState.onBulletHitBot(onBulletRemoved);
        arenaState.onBulletHitTerrain(onBulletRemoved);
        arenaState.onShotFired(onShotFired);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 1000);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 100, 0);

        var loader1 = new THREE.AssimpJSONLoader();
        loader1.load('Content/models/jeep.assimp.json', function (object) {
        
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

        addLandscape();
        addTerrain(arenaState);
        
        addLights();
    }

    function onBotKilled(bot) {
        removeMeshFromScene(bot.mesh);
        removeMeshFromScene(bot.healthBarMesh);
    }

    function onBulletRemoved(bullet) {
        removeMeshFromScene(bullet.mesh);
    }

    function onShotFired(bot, bullet) {
        
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

            setMeshRotation(bullet, bullet.mesh);
            setMeshPosition(bullet, bullet.mesh, 5);
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
            setMeshRotation(bot.mesh);
            setMeshPosition(bot, bot.mesh, 5);

            scene.add(bot.mesh);
        }
    }

    function addBotModels(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            bot.mesh = tankModel.clone();

            setMeshRotation(bot, bot.mesh, 180);
            setMeshPosition(bot, bot.mesh, 5);
            scene.add(bot.mesh);

            var boxGeometry = new THREE.BoxGeometry(12, 2, 2);
            var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xce2121 })
            bot.healthBarMesh = new THREE.Mesh(boxGeometry, boxMaterial);

            setMeshPosition(bot, bot.healthBarMesh, 15);
            scene.add(bot.healthBarMesh);
        }
    }

    function updateBots(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            setMeshRotation(bot, bot.mesh, 180);
            setMeshPosition(bot, bot.mesh);

            setMeshPosition(bot, bot.healthBarMesh);
            if (bot.healthBarMesh) {
                bot.healthBarMesh.scale.x = bot.healthPercentage();
            }
        }
    }

    function setMeshRotationByAngle(mesh, angle) {
        if (!mesh)
            return;

        mesh.rotation.y = gosu.math.degreesToRadians(angle);
    }

    function setMeshRotation(object, mesh, additionalRotation) {
        if (!mesh)
            return;

        var angle = -object.angle + additionalRotation || 0;
        mesh.rotation.y = gosu.math.degreesToRadians(angle);
    }

    function setMeshPosition(object, mesh, y) {
        if (!mesh)
            return;

        y = y || mesh.position.y;
        var position = toCartesianCoordinates(object.center(), 100);

        mesh.position.set(position.x, y, position.z);
    }

    function render(arenaState) {
        updateBots(arenaState);
        renderBullets(arenaState);

        controls.update();

        renderer.render(scene, camera);
    }

    function removeMeshFromScene(mesh) {
        if (mesh) {
            scene.remove(mesh);
        }
    }

    function toCartesianCoordinates(vec2D) {
        var x = (vec2D.x / WIDTH) * 2 - 1;
        var z = -(vec2D.y / HEIGHT) * 2 + 1;

        return new THREE.Vector3(x * SCALE, 0, -z * SCALE);
    }

    return {
        initialize: initialize,
        removeMeshFromScene: removeMeshFromScene,
        render: render
    };
};
