var gosuArena = gosuArena || {};
gosuArena.commander = gosuArena.commander || {};

gosuArena.commander.createGameListener = function (callback) {

    function initialize(arenaState) {

        gosuArena.events.gameStarting(function () {
            gosuArena.realtime.call(function(connection) {
                var botInfos = arenaState.bots.map(function (bot) {
                    console.log(bot.commandNames());
                    return {
                        id: bot.id,
                        name: bot.name,
                        health: bot.health,
                        commands: bot.commandNames()
                    };
                });

                connection.gameHub.server.gameStarting(gosuArena.settings.gameRoom.id, botInfos);
            });
        });

        arenaState.onBotAugmentationActivated(function (bot, augmentation) {
        });

        arenaState.onBotAugmentationDeactivated(function (bot, augmentation) {
        });
    }

    return {
        initialize: initialize
    };

};