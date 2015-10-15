var gosuArena = gosuArena || {};

gosuArena.engine = (function () {
    var arenaState = gosuArena.arenaState.create();
    var readyForBotRegistrationCallbacks = [];
    var matchStartedCallbacks = [];
    var isTraining = null;
    var gameListeners = [];
    var resourceLoaders = [];

    var arenaHeight = 550;
    var arenaWidth = 750;
    var wallThickness = 25;

    var collisionDetector = gosuArena.factories.createCollisionDetector(arenaState);

    var botRegistrar = gosuArena.botRegistrar.create(collisionDetector, arenaState);

    gosuArena.initiateBotRegistration = botRegistrar.initiateBotRegistration;
    gosuArena.register = botRegistrar.register;

    gosuArena.readyForBotRegistration = function (callback) {
        readyForBotRegistrationCallbacks.push(callback);
    };

    gosuArena.matchStarted = function (callback) {
        matchStartedCallbacks.push(callback);
    }

    function initializeTerrain() {

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
                arenaState.bulletHitBot(bullet);
            });
        });

        arenaState.terrain.forEach(function (terrain) {
            var hitBullets = collisionDetector.bulletsHitTerrain(terrain);

            hitBullets.forEach(function (bullet) {
                arenaState.bulletHitTerrain(bullet);
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
    }

    function tick() {

        updateBots();
        updateBullets();

        arenaState.tick();
    }

    function initializeGameListeners() {
        gameListeners.forEach(function (listener) {
            listener.initialize(arenaState);
        });
    }

    function raiseReadyForBotRegistrationEvent() {
        readyForBotRegistrationCallbacks.forEach(function (callback) {

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

    function loadResources(onResourcesLoadedCallback) {

        // Copy the loaders array, to keep track of which loaders have not
        // yet finished loading their stuff
        var remainingLoaders = resourceLoaders.slice();

        function createMarkLoaderAsFinishedCallback(loader) {
            return function() {
                var index = remainingLoaders.indexOf(loader);

                // Remove the loader from the array of remaining loaders, when it finishes
                if (index >= 0) {
                    remainingLoaders.splice(index, 1);
                }

                // If there are no loaders which still have not finished loading, 
                // then everything is loaded and we can go on with the game
                if (remainingLoaders.length <= 0) {
                    onResourcesLoadedCallback();
                }
            };
        }

        for (var i = 0; i < resourceLoaders.length; i++) {
            var loader = resourceLoaders[i];
            loader.load(arenaState, createMarkLoaderAsFinishedCallback(loader));
        }
    }

    function restartMatch(gameClock, options) {
        options = options || {};

        gameListeners = options.listeners || [];
        resourceLoaders = options.resourceLoaders || [];

        isTraining = options.isTraining;

        botRegistrar.setIsTraining(isTraining);

        arenaState.clear();

        gosuArena.arenaWidth = arenaWidth;
        gosuArena.arenaHeight = arenaHeight;

        initializeTerrain();

        // This triggers all bots to actually register to the bot registrar,
        // so after this the bots have actually been registered with the game engine
        raiseReadyForBotRegistrationEvent();

        fixStartPositionsToAvoidCollisions();

        // Start the match when all resources have been loaded
        loadResources(function() {

            initializeGameListeners();

            startGameLoop(gameClock);
            raiseMatchStartedEvent();
        });
    }

    function reset() {
        arenaState.clear();
        readyForBotRegistrationCallbacks.length = 0;
    }

    return {
        start: restartMatch,
        reset: reset
    };
})();
