var gosuArena = gosuArena || {};
gosuArena.logging = gosuArena.logging || {};

gosuArena.logging.createEventConsoleLogger = function() {

    function log(text) {
        console.log(text);
    }

    function initialize(arenaState) {
        arenaState.onBotAugmentationActivated(function(bot, augmentation) {
            log(bot.name + " activated " + augmentation.name);
        });
        
        arenaState.onBotAugmentationDeactivated(function(bot, augmentation) {
            log(bot.name + " deactivated " + augmentation.name);
        });
    }

    return {
        initialize: initialize
    };
};
