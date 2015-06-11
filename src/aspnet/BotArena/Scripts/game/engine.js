var gosuArena = gosuArena || {};

gosuArena.engine = (function () {
    var arenaState = gosuArena.arenaState.create();
    var readyCallbacks = [];
    var matchStartedCallbacks = [];
    var isTraining = null;
    var gameListeners = [];
    var visualizer = null;
    var visualizer3D = null;
    var renderingMode = "3D";
    var collisionDetector = gosuArena.factories.createCollisionDetector(arenaState);

    var botRegistrar = gosuArena.botRegistrar.create(collisionDetector, arenaState);

    gosuArena.initiateBotRegistration = botRegistrar.initiateBotRegistration;
    gosuArena.register = botRegistrar.register;

    gosuArena.ready = function(callback) {
        readyCallbacks.push(callback);
    };

    gosuArena.matchStarted = function (callback) {
        matchStartedCallbacks.push(callback);
    }

    function initializeTerrain() {

        // Coordinates here need to be given in the game coordinate
        // system to make the collission detection work properly.
        // The coordinates will be transformed to the canvas coordinate
        // system at render time

        var arenaHeight = visualizer.arenaHeight;
        var arenaWidth = visualizer.arenaWidth;
        var wallThickness = visualizer.wallThickness;

        var horizontalWallWidth = arenaWidth + 2 * wallThickness;
        var verticalWallWidth = arenaHeight + 2 * wallThickness;

        var westWallCenter = {
            x: -wallThickness / 2,
            y: arenaHeight / 2
        };

        var westWall = gosuArena.factories.createTerrain({
            x: westWallCenter.x - verticalWallWidth / 2,
            y: westWallCenter.y - wallThickness / 2,
            width: verticalWallWidth,
            height: wallThickness,
            angle: 270
        });

        var eastWallCenter = {
            x: arenaWidth + wallThickness / 2,
            y: arenaHeight / 2
        };

        var eastWall = gosuArena.factories.createTerrain({
            x: eastWallCenter.x - verticalWallWidth / 2,
            y: eastWallCenter.y - wallThickness / 2,
            width: verticalWallWidth,
            height: wallThickness,
            angle: 90
        });

        var northWallCenter = {
            x: arenaWidth / 2,
            y: -wallThickness / 2
        };

        var northWall = gosuArena.factories.createTerrain({
            x: northWallCenter.x - horizontalWallWidth / 2,
            y: northWallCenter.y - wallThickness / 2,
            width: horizontalWallWidth,
            height: wallThickness,
            angle: 0
        });

        var southWallCenter = {
            x: arenaWidth / 2,
            y: arenaHeight + wallThickness / 2
        };

        var southWall = gosuArena.factories.createTerrain({
            x: southWallCenter.x - horizontalWallWidth / 2,
            y: southWallCenter.y - wallThickness / 2,
            width: horizontalWallWidth,
            height: wallThickness,
            angle: 180
        });

        arenaState.addTerrain(eastWall);
        arenaState.addTerrain(westWall);
        arenaState.addTerrain(northWall);
        arenaState.addTerrain(southWall);
    }

    function fixStartPositionsToAvoidCollisions() {
        arenaState.bots.forEach(function (bot) {
            while (collisionDetector.hasCollided(bot)) {
                bot.teleportToRandomLocation();
            }
        });
    }

    function updateBots() {
        arenaState.livingBots().forEach(function(bot) {
            bot.tick();
        });
    }

    function updateBullets() {

        arenaState.bullets.forEach(function (bullet) {
            bullet.tick();
        });

        arenaState.livingBots().forEach(function (bot) {
            var hitBullets = collisionDetector.hitBullets(bot);

            hitBullets.forEach(function (bullet) {
                bot.hitBy(bullet);
                arenaState.removeBullet(bullet);
                visualizer3D.removeMeshFromScene(bullet.mesh);
            });
        });

        arenaState.terrain.forEach(function (terrain) {
            var hitBullets = collisionDetector.bulletsHitTerrain(terrain);

            hitBullets.forEach(function (bullet) {
                arenaState.removeBullet(bullet);
                visualizer3D.removeMeshFromScene(bullet.mesh);
            });
        });
    }

    function startGameLoop(gameClock) {
        gameClock.tick(tick);
    }

    var hasStartedBenchmark = false;

    // 1000 iterations: 1000 ms @ 2014-01-08
    function benchmark() {

        if (hasStartedBenchmark) {
            return;
        }

        hasStartedBenchmark = true;

        var startTime = new Date().getTime();

        for (var i = 0; i < 1000; i++) {
            updateBots();
            updateBullets();
        }

        var endTime = new Date().getTime();
        console.log("Time (ms): "  + (endTime - startTime));

        visualizer.render(arenaState);
    }

    function tick() {

        updateBots();
        updateBullets();

        if (renderingMode === "2D") {
            visualizer.render(arenaState);
        }
        else {
            visualizer3D.render(arenaState);
        }
    }

    function initializeGameListeners() {
        gameListeners.forEach(function (listener) {
            listener.initialize(arenaState);
        });
    }

    function raiseReadyEvent() {
        readyCallbacks.forEach(function (callback) {

            // Invoke the callback with an empty object as this
            // to reduce hacking opportunities
            callback.call({});
        });
    }

    function raiseMatchStartedEvent() {
        matchStartedCallbacks.forEach(function(callback) {
            callback.call({});
        });
    }

    function restartMatch(gameVisualizer, gameVisualizer3D, gameClock, options) {
        options = options || {};

        gameListeners = options.listeners || [];
        isTraining = options.isTraining;

        botRegistrar.setIsTraining(isTraining);
        visualizer = gameVisualizer;
        visualizer3D = gameVisualizer3D;


        arenaState.clear();

        gosuArena.arenaWidth = gameVisualizer.arenaWidth;
        gosuArena.arenaHeight = gameVisualizer.arenaHeight;

        initializeTerrain();
        initializeGameListeners();

        raiseReadyEvent();

        fixStartPositionsToAvoidCollisions();

        visualizer3D.createScene(arenaState);

        startGameLoop(gameClock);

        raiseMatchStartedEvent();
    }

    function reset() {
        arenaState.clear();
        readyCallbacks.length = 0;
        nextBotId = 0;
    }

    function setRenderingMode(mode) {
        if (mode === "2D") {
            renderingMode = "2D";
        }
        else {
            renderingMode = "3D";
        }
    }

    return {
        start: restartMatch,
        reset: reset,
        setRenderingMode: setRenderingMode
    };
})();
