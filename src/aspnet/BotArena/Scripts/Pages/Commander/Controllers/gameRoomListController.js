angular.module("commander").controller("gameRoomListController", function ($scope, $http, gameHubService) {
    gameHubService.getGameRooms(function (gameRooms) {
        console.log("Available game rooms: " + JSON.stringify(gameRooms));
        $scope.gameRooms = gameRooms;
    });
});