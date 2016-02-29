var gosuArena = gosuArena || {};
gosuArena.rules = gosuArena.rules || {};

gosuArena.rules.createBotConfigValidationRule = function (gameClock, options) {

    var arenaState;
    
    function hasValue(val) {
        return val !== undefined && val !== null;
    }

    function isModifierCountValidForModifierType(bot, modifierType, maxAllowedForModifierType) {
        var staticModifiers = bot.staticModifiers();

        var modifiersMatchingCategory = staticModifiers.modifiers.filter(function(modifier) {
            return modifier.type === modifierType;
        });

        return modifiersMatchingCategory.length <= maxAllowedForModifierType;
    }

    function isBotValid(bot) {
        if (hasValue(options.maxAllowedAugmentationCount) && bot.augmentationNames().length > options.maxAllowedAugmentationCount) {
            return false;
        }

        for (var prop in options.modifiers) {
            if (options.modifiers.hasOwnProperty(prop)) {

                var maxAllowedForCategory = options.modifiers[prop].maxAllowedCount;
                var isValid = isModifierCountValidForModifierType(bot, prop, maxAllowedForCategory);

                if (!isValid) {
                    return false;
                }
            }
        }

        return true;
    }

    function initialize(initArenaState) {
        arenaState = initArenaState;
    }

    function tick() {
        var botsWithValidationErrors = [];

        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];

            if (!isBotValid(bot)) {
                botsWithValidationErrors.push(bot);
            }
        }

        if (botsWithValidationErrors.length > 0) {
            gosuArena.events.raiseBotValidationErrors(botsWithValidationErrors);
            gameClock.stop();
        }
    }

    return {
        initialize: initialize,
        tick: tick
    };
};