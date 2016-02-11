angular.module("menuApp").controller("botListCtrl", ["$scope", "$state", "$http", "notificationService", function ($scope, $state, $http, notificationService) {

    $scope.editBot = function(botId) {
        $state.go("editbot", { botId: botId });
    } 

    $http({
            method: "GET",
            url: gosuArena.url.createAbsolute("/api/bots?currentUser=true")
        })
        .then(function(response) {
            $scope.bots = response.data;
        }, function(e) {
            notificationService.showUnexpectedErrorMessage(e);
        });
    }
]);