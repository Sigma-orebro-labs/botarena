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
                gameHub.server.getOpenGameRooms().done(function(gameRooms) {
                    $rootScope.$apply(function () {
                        callback(gameRooms);
                    });
                });
            });
        }

        return {
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            getGameRooms: getGameRooms
        };
    }

    angular.module('commander').factory('gameHubService', gameHubService);
})();