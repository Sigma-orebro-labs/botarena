var gosuArena = gosuArena || {};
gosuArena.commander = gosuArena.commander || {};

(function() {

    function updateGameRoomWithBotsInGame(arenaState) {
        gosuArena.realtime.call(function (connection) {
            var botInfos = arenaState.bots.map(function (bot) {
                return {
                    id: bot.id,
                    name: bot.name,
                    health: bot.health(),
                    commands: bot.commandNames()
                };
            });

            connection.gameHub.server.gameStarting(gosuArena.settings.gameRoom.id, botInfos)
                .done(function () {
                    console.log("Updated game room with bot info");
                })
                .fail(function (e) {
                    console.error(e);
                });
        });
    }

    function pingServer() {
        gosuArena.realtime.call(function (connection) {
            connection.gameHub.server.ping(gosuArena.settings.gameRoom.id)
            .done(function () {
                console.log("Pinged server to keep game room active");
            })
            .fail(function (e) {
                console.error(e);
            });
        });
    }

    function logReceivedCommand(roomId, botId, commandName) {
        console.log(gosuArena.settings.gameRoom.id + ": Command '" + commandName + "' recieved for bot " + botId + " in " + roomId)
    }

    function executeBotCommand(roomId, botId, commandName) {
        logReceivedCommand(roomId, botId, commandName);
        gosuArena.engine.executeBotCommand(botId, commandName);
    }

    function registerClientCommands() {
        $.connection.gameHub.client.onCommand = executeBotCommand;
    }

    function startGameRoom() {
        gosuArena.realtime.call(function (connection) {
            var gameHub = connection.gameHub;

            gameHub.server.createGameRoom().done(function (room) {
                console.log("Started game room: " + room.id + "...");
                gosuArena.settings.gameRoom = room;
            }).fail(function (e) {
                console.error(e);
            });
        });
    }

    gosuArena.commander.createGameListener = function () {

        registerClientCommands();

        startGameRoom();

        function initialize(arenaState) {

            setInterval(pingServer, 20000);

            gosuArena.events.gameStarting(function () {
                updateGameRoomWithBotsInGame(arenaState);
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

})();

