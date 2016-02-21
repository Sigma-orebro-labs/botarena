angular.module("commander").controller("botCommanderController", function ($scope, $http, $stateParams, gameHubService) {

    console.log("Room: " + $stateParams.roomId);
    console.log("Bot: " + $stateParams.botId);

    $scope.roomId = $stateParams.roomId;

    $scope.sendCommand = function(command) {
        gameHubService.sendCommand($stateParams.roomId, $stateParams.botId, command, function() {
            console.log("Successfully sent command: " + command);
        });
    }

    gameHubService.getBot($stateParams.roomId, $stateParams.botId, function (bot) {
        console.log("Loaded bot: " + JSON.stringify(bot));
        $scope.bot = bot;
    });
});