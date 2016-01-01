angular.module("menuApp").controller("botListCtrl", ["$scope", "$http", "notificationService", function ($scope, $http, notificationService) {

        $scope.createEditUrl = function(bot) {
            return gosuArena.url.createAbsolute("/Bot/Edit/" + bot.id);
        };

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