var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createGameVisualizer3D = function (canvas) {
    // Constants
    var width = canvas.width;
    var height = canvas.height;
    var SCALE = 100;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);

    var scene = null;
    var camera = null;
    var tankModel = null;
    var landscape = null;
    var controls = null;

    function initialize(arenaState) {
        console.log(arenaState);
        arenaState.onBotKilled(onBotKilled);
        arenaState.onBulletHitBot(onBulletRemoved);
        arenaState.onBulletHitTerrain(onBulletRemoved);
        arenaState.onShotFired(onShotFired);
        arenaState.onTick(function () {
            render(arenaState);
        });

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);

        var loader1 = new THREE.AssimpJSONLoader();
        loader1.load('Content/models/jeep.assimp.json', function (object) {
        
            object.rotation.x = gosu.math.degreesToRadians(-90);
            object.scale.x = object.scale.y = object.scale.z = 2;

            tankModel = object;
            addBotModels(arenaState);
        });


        var axisHelper = new THREE.AxisHelper(50);
        axisHelper.position.z = -70;
        scene.add(axisHelper);

        camera.position.z = 500;
        camera.position.y = -550;
        camera.position.x = 0;
        camera.lookAt(new THREE.Vector3(0, 0, 0));


        addLandscape();
        addTerrain(arenaState);
        addLights();

        scene.rotateOnAxis(new THREE.Vector3(1, 0, 0), gosu.math.degreesToRadians(-180))
        scene.translateX(-(width / 2));
        scene.translateY(-(height / 2));

        //controls = new THREE.OrbitControls(camera);
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
                var sphereGeometry = new THREE.SphereGeometry(3, 10, 10);
                var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x6F553A });

                bullet.mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
                scene.add(bullet.mesh);
            }

            setMeshRotation(bullet, bullet.mesh);
            setMeshPosition(bullet, bullet.mesh, -10);
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
            landscape.rotation.set(-Math.PI * 1.0, 0, 0);
            landscape.translateX(400);
            landscape.scale.x = landscape.scale.y = landscape.scale.z = 100;
            scene.add(landscape);
        });
    }

    function addTerrain(arenaState) {
        for (var i = 0; i < arenaState.terrain.length; i++) {
            var terrain = arenaState.terrain[i];

            var boxGeometry = new THREE.BoxGeometry(terrain.width, 10, 10, 1, 1);
            var boxMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });

            var mesh = new THREE.Mesh(boxGeometry, boxMaterial);

            mesh.rotation.z = gosu.math.degreesToRadians(terrain.angle);

            var position = terrain.center();
            mesh.position.set(position.x, position.y, -10);

            scene.add(mesh);
        }
    }

    function addLights() {
        var ambientLight = new THREE.AmbientLight(0x404040, 1.5);
        scene.add(ambientLight);
        
        addDirectionalLight(new THREE.Vector3(800, 600, -100));
        addDirectionalLight(new THREE.Vector3(0, 0, -200));
        addDirectionalLight(new THREE.Vector3(800, 0, -200));
        addDirectionalLight(new THREE.Vector3(0, 600, -200));
    }

    function addDirectionalLight(position) {
        var directionalLight = new THREE.DirectionalLight(0x404040, 2.0);

        directionalLight.position.x = position.x;
        directionalLight.position.y = position.y;
        directionalLight.position.z = position.z;

        scene.add(directionalLight);
    }

    function addPointLight(x, y, z) {
        var light = new THREE.PointLight(0xffffff, 0.8, 0);
        light.position.set(x, y, z);
        scene.add(light);
    }

    function addBotModels(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            bot.mesh = tankModel.clone();

            setMeshRotation(bot, bot.mesh, 180);
            setMeshPosition(bot, bot.mesh, 5);
            bot.mesh.baseRotation = 180;

            scene.add(bot.mesh);

            var boxGeometry = new THREE.BoxGeometry(12, 2, 2);
            var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xce2121 })
            bot.healthBarMesh = new THREE.Mesh(boxGeometry, boxMaterial);

            setMeshPosition(bot, bot.healthBarMesh, -20);
            scene.add(bot.healthBarMesh);
        }
    }

    function updateBots(arenaState) {
        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            setMeshRotation(bot, bot.mesh, 0);
            setMeshPosition(bot, bot.mesh);

            setMeshPosition(bot, bot.healthBarMesh, -20);
            if (bot.healthBarMesh) {
                bot.healthBarMesh.scale.x = bot.healthPercentage();
            }
        }
    }

    function setMeshRotation(object, mesh) {
        if (!mesh)
            return;

        var baseRotation = mesh.baseRotation || 0;
        mesh.rotation.y = gosu.math.degreesToRadians(-object.angle + baseRotation);
    }

    function setMeshPosition(object, mesh, z) {
        if (!mesh)
            return;

        z = z || 0;
        var position = object.center();
        mesh.position.set(position.x, position.y, z);
    }

    function render(arenaState) {
        updateBots(arenaState);
        renderBullets(arenaState);

        //controls.update();

        renderer.render(scene, camera);
    }

    function removeMeshFromScene(mesh) {
        if (mesh) {
            scene.remove(mesh);
        }
    }

    return {
        initialize: initialize,
        render: render
    };
};
