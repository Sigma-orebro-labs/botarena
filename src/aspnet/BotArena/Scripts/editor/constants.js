var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createSceneEditor = function (canvas) {
    var width = canvas.width;
    var height = canvas.height;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(width, height);

    var scene = null;
    var camera = null;

    function initialize() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3(0, 0, 0);

        camera.position.z = 100;

        render();
    }

    function addMesh(options) {
        var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
        var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xce2121 })
        var mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        scene.add(mesh);
    }

    function render() {
        requestAnimationFrame(render);
        controls.update();
        renderer.render(scene, camera);
    }

    return {
        initialize: initialize,
        addMesh: addMesh
    };
};
