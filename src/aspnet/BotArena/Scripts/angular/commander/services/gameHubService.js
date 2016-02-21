(function() {
    function gameHubService($rootScope) {

        var gameHub = $.connection.gameHub;

        var disconnect = gosuArena.realtime.disconnect;
        var connect = gosuArena.realtime.connect;

        function subscribe(gameRoomId, options) {

            console.log("Subscribing for events for game room: " + gameRoomId);

            disconnect();

            gameHub.client.botKilled = function(gameRoomId, botId) {

                console.log("Bot killed: " + botId);

                $rootScope.$apply(function() {
                    
                });
            };

            connect(function() {
                gameHub.server.subscribe(gameRoomId);
            });
        }

        function unsubscribe(gameRoomId) {

            console.log("Unsubscribing from events for game room: " + gameRoomId);

            $.connection.hub.stop();

            connect(function() {
                gameHub.server.unsubscribe(gameRoomId);
            });
        }

        function getGameRooms(callback) {
            connect(function () {
                gameHub.server.getOpenGameRooms()
                    .done(function (gameRooms) {
                        $rootScope.$apply(function () {
                            callback(gameRooms);
                        });
                    }).fail(function (e) {
                        console.error(e);
                    });
            });
        }

        function getGameRoom(id, callback) {
            connect(function () {
                gameHub.server.getGameRoom(id)
                    .done(function (gameRoom) {
                        $rootScope.$apply(function () {
                            callback(gameRoom);
                        });
                    }).fail(function(e) {
                        console.error(e);
                    });
            });
        }

        function getBot(roomId, botId, callback) {
            connect(function () {
                gameHub.server.getBot(roomId, botId)
                    .done(function (bot) {
                        $rootScope.$apply(function () {
                            callback(bot);
                        });
                    }).fail(function(e) {
                        console.error(e);
                    });
            });
        }

        return {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            getGameRooms: getGameRooms,
            getGameRoom: getGameRoom,
            getBot: getBot
        };
    }

    angular.module('commander').factory('gameHubService', gameHubService);
})();