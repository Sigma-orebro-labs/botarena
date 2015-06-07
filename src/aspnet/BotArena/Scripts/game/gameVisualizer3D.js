var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizer3D = function (canvas) {
    // Constants
    var WIDTH = 800;
    var HEIGHT = 600;
    var CAMERA_MOVE_SPEED = 5;
    var CAMERA_ROTATION_SPEED = 1;

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
    var cube = null;
    var plane = null;

    function createScene(arenaState) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

        camera.position.x = -5;
        camera.position.y = 150;
        camera.position.z = 60;
        camera.rotation.x = gosu.math.degreesToRadians(-70);

        // Top downish camera
        //camera.position.x = -5;
        //camera.position.y = 150;
        //camera.position.z = -10;
        //camera.rotation.x = gosu.math.degreesToRadians(-90);

        addPlane();
        addTerrain(arenaState);

        addBots(arenaState);
        addLights();

        addEventListeners();
    }

    function renderBullets(arenaState) {
        for (var i = 0; i < arenaState.bullets.length; i++) {
            var bullet = arenaState.bullets[i];
        
            if (!bullet.mesh) {
                var sphereGeometry = new THREE.SphereGeometry(3, 30, 30);

                var sphereMaterial = new THREE.MeshPhongMaterial({
                    color: 0xff0000,
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
        var planeGeometry = new THREE.PlaneGeometry(600, 600);
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x6F553A });
        planeMaterial.side = THREE.DoubleSide;
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = gosu.math.degreesToRadians(90);

        scene.add(plane);
    }

    function addTerrain(arenaState) {
        for (var i = 0; i < arenaState.terrain.length; i++) {
            var terrain = arenaState.terrain[i];

            var boxGeometry = new THREE.BoxGeometry(200, 20, 5);
            var boxMaterial = new THREE.MeshPhongMaterial({
                shininess: 20,
                metal: true
            })

            terrain.mesh = new THREE.Mesh(boxGeometry, boxMaterial);

            setMeshRotation(terrain);
            setMeshPosition(terrain, 10);

            scene.add(terrain.mesh);
        }
    }

    function addLights() {
        var ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2.5);
        scene.add(hemisphereLight);

        addPointLight(60, 10, -60);
        addPointLight(-60, 10, -60);
        addPointLight(60, 10, 60);
        addPointLight(-60, 10, 60);
        addPointLight(0, 10, 0);
        
        addPointLight(75, 20, -75);
        addPointLight(-75, 20, -75);
        addPointLight(75, 20, 75);
        addPointLight(-75, 20, 75);
        addPointLight(0, 20, 0);
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

    function updateBots(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            if (!bot.isAlive()) {
                removeObjectFromScene(bot);
            }
            
            setMeshRotation(bot);
            setMeshPosition(bot);
        }
    }

    function setMeshRotation(bot) {
        bot.mesh.rotation.y = gosu.math.degreesToRadians(-bot.angle);
    }

    function setMeshPosition(bot, y) {
        y = y || bot.mesh.position.y;
        var position = toCartesianCoordinates(bot.center(), 100);
        bot.mesh.position.set(position.x, y, position.z);
    }

    function toCartesianCoordinates(pos2D, scale) {
        var x = (pos2D.x / WIDTH) * 2 - 1;
        var z = (pos2D.y / HEIGHT) * 2 - 1;

        return new THREE.Vector3(x * scale, 0, z * scale);
    }

    function render(arenaState) {
        updateBots(arenaState);
        renderBullets(arenaState);
        renderer.render(scene, camera);
    }

    function removeObjectFromScene(object) {
        if (object && object.mesh) {
            scene.remove(object.mesh);
        }
    }

    function addEventListeners() {
        window.addEventListener('keydown', function (e) { onKeyDown(event); }, false);
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
            camera.rotation.x -= gosu.math.degreesToRadians(CAMERA_ROTATION_SPEED);
        }
    }

    return {
        createScene: createScene,
        removeObjectFromScene : removeObjectFromScene,
        render: render
    };
};
