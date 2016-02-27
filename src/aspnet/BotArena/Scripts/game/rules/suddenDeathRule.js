var gosuArena = gosuArena || {};
gosuArena.rules = gosuArena.rules || {};

gosuArena.rules.createSuddenDeathRule = function (gameClock, options) {

    var arenaState;
    var collisionDetector;
    var roundCount = 0;

    function reduceBotHealths(factor) {
        for (var i = 0; i < arenaState.livingBots().length; i++) {
            var bot = arenaState.livingBots()[i];
            bot.smite(bot.health() * factor);
        }
    }

    function randomizeBotPositions() {
        gosuArena.positioning.randomizeBotPositions(arenaState.livingBots(), collisionDetector);
    }

    function initialize(initArenaState, initCollisionDetector) {
        arenaState = initArenaState;
        collisionDetector = initCollisionDetector;
    }

    function tick() {
        roundCount++;

        if (roundCount % options.roundCount === 0) {
            reduceBotHealths(options.healthReductionFactor);
            randomizeBotPositions();
            gosuArena.events.raiseSuddenDeath(roundCount / options.roundCount);
        }
    }

    return {
        initialize: initialize,
        tick: tick
    };
};