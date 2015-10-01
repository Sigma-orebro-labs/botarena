var gosuArena = gosuArena || {};
gosuArena.botRegistrar = gosuArena.botRoster || {};

gosuArena.botRegistrar.create = function (collisionDetector, arenaState) {
    var nextUniqueBotId = 1;
    var isTraining = false;
    var currentRegisteringBotInternalOptions = null;
    var currentRegisteringBotUserOptions = null;

    function setIsTraining(value) {
        isTraining = value;
    }
    
    function initiateBotRegistration (options, callback) {

        // This makes sure that we keep track of the name of the bot being
        // registered during the execution of the bot script, so that
        // we can automatically initialize the bot with the name
        // given when creating the bot.
        gosuArena.ready(function () {

            beginBotRegistration(options);
            
            callback();

            commitBotRegistration();
        });
    };

    function register(options) {
        currentRegisteringBotUserOptions = options;
    };
    
    function beginBotRegistration(options) {
        currentRegisteringBotInternalOptions = options;
    }

    function commitBotRegistration() {
        var options = currentRegisteringBotUserOptions;;
        
        options.options = options.options || {};

        options.options.name = currentRegisteringBotInternalOptions.name;
        options.options.id = currentRegisteringBotInternalOptions.id;
        options.options.teamId = currentRegisteringBotInternalOptions.teamId;
        options.options.uniqueId = nextUniqueBotId++;
        
        var botOptions =
            gosuArena.factories.createSafeBotOptions(options.options, isTraining);

        var bot = gosuArena.factories.createBot(options.tick, botOptions, collisionDetector);

        if (typeof options.onHitByBullet === 'function') {
            bot.onHitByBullet(options.onHitByBullet);
        }
        if (typeof options.onCollision === 'function') {
            bot.onCollision(options.onCollision);
        }

        arenaState.addBot(bot);

        currentRegisteringBotInternalOptions = null;
    }

    return {
        initiateBotRegistration: initiateBotRegistration,
        register: register,
        setIsTraining: setIsTraining
    };
}
