var gosuArena = gosuArena || {};
gosuArena.rules = gosuArena.rules || {};

gosuArena.rules.createBotConfigValidationRule = function (gameClock, options) {

    var arenaState;

    function hasValue(val) {
        return val !== undefined && val !== null;
    }

    function hasValidationErrors(bot) {
        if (hasValue(options.maxAllowedAugmentationCount) && bot.augmentationNames().length > options.maxAllowedAugmentationCount) {
            return true;
        }
    }

    function initialize(initArenaState) {
        arenaState = initArenaState;
    }

    function tick() {

        var botsWithValidationErrors = [];

        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            if (hasValidationErrors(bot)) {
                botsWithValidationErrors.push(bot);
            }
        }

        if (botsWithValidationErrors.length > 0) {
            gosuArena.events.raiseBotValidationErrors(botsWithValidationErrors);
        }
    }

    return {
        initialize: initialize,
        tick: tick
    };
};