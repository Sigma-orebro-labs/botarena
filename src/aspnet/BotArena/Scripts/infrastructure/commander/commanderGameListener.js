var gosuArena = gosuArena || {};
gosuArena.commander = gosuArena.commander || {};

gosuArena.commander.createGameListener = function (callback) {

    $.connection.gameHub.client.foo = function () {
        console.log("foo received");
    }

    $.connection.gameHub.client.onCommand = function (roomId, botId, commandName) {
        console.log(gosuArena.settings.gameRoom.id + ": Command '" + commandName + "' recieved for bot " + botId + " in " + roomId)
    }

    gosuArena.realtime.call(function (connection) {
        var gameHub = connection.gameHub;

        gameHub.server.createGameRoom().done(function (room) {
            console.log("Started game room: " + room.id + "...");
            gosuArena.settings.gameRoom = room;
        }).fail(function (e) {
            console.error(e);
        });
    });

    var pingIntervalHandle = null;

    function pingServer() {
        gosuArena.realtime.call(function(connection) {
            connection.gameHub.server.ping(gosuArena.settings.gameRoom.id)
            .done(function() {
                console.log("Pinged server to keep game room active");
            })
            .fail(function(e) {
                console.error(e);
            });
        });
    }

    function initialize(arenaState) {

        pingIntervalHandle = setInterval(pingServer, 20000);

        gosuArena.events.gameStarting(function () {
            gosuArena.realtime.call(function(connection) {
                var botInfos = arenaState.bots.map(function (bot) {
                    return {
                        id: bot.id,
                        name: bot.name,
                        health: bot.health(),
                        commands: bot.commandNames()
                    };
                });

                connection.gameHub.server.gameStarting(gosuArena.settings.gameRoom.id, botInfos)
                    .done(function() {
                        console.log("Updated game room with bot info");
                    })
                    .fail(function(e) {
                        console.error(e);
                    });
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