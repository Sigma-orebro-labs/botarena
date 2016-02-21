angular.module("commander").controller("gameRoomController", function ($scope, $http, $stateParams, gameHubService) {

    gameHubService.getGameRoom($stateParams.roomId, function (gameRoom) {
        console.log("Loaded game room: " + JSON.stringify(gameRoom));
        $scope.gameRoom = gameRoom;
    });
});