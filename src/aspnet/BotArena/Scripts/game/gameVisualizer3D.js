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
    }

    function addPlane() {
        var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
        var planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        planeMaterial.side = THREE.DoubleSide;
        plane = new THREE.Mesh(planeGeometry, planeMaterial);

        plane.rotation.x = gosu.math.degreesToRadians(90);

        scene.add(plane);
    }

    function addTerrain(arenaState) {
        for (var i = 0; i < arenaState.terrain.length; i++) {
            var terrain = arenaState.terrain[i];

            var boxGeometry = new THREE.BoxGeometry(200, 20, 5);
            var boxMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
            terrain.mesh = new THREE.Mesh(boxGeometry, boxMaterial);

            setMeshRotation(terrain);
            setMeshPosition(terrain);

            scene.add(terrain.mesh);
        }
    }

    function addLights() {
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        var light = new THREE.AmbientLight(0x404040);
        scene.add(light);
    }

    function addBots(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
            var boxMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });

            bot.mesh = new THREE.Mesh(boxGeometry, boxMaterial);
            setMeshRotation(bot);
            setMeshPosition(bot);

            scene.add(bot.mesh);
        }
    }

    function updateBots(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];
            setMeshRotation(bot);
            setMeshPosition(bot);
        }
    }

    function setMeshRotation(bot) {
        bot.mesh.rotation.y = gosu.math.degreesToRadians(-bot.angle);
    }

    function setMeshPosition(bot) {
        var position = toCartesianCoordinates(bot.center(), 100);
        bot.mesh.position.set(position.x, 0, position.z);
    }

    function toCartesianCoordinates(pos2D, scale) {
        var x = (pos2D.x / WIDTH) * 2 - 1;
        var z = (pos2D.y / HEIGHT) * 2 - 1;

        return new THREE.Vector3(x * scale, 0, z * scale);
    }

    function render(arenaState) {
        updateBots(arenaState);
        renderer.render(scene, camera);
    }

    return {
        createScene: createScene,
        render: render
    };
};
