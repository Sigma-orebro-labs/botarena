angular.module("menuApp").controller("botListCtrl", ["$scope", "$state", "$http", "notificationService", function($scope, $state, $http, notificationService) {

        function deleteBot(botId) {
            $http({
                method: "DELETE",
                url: gosuArena.url.createAbsolute("/api/bots/" + botId)
            })
            .then(function (response) {
                notificationService.showSuccessMessage("Bot deleted", "Your bot has been deleted!");

                $scope.bots = $scope.bots.filter(function(bot) {
                    return bot.id !== botId;
                });

                }, function (e) {
                notificationService.showUnexpectedErrorMessage(e);
            });
        }


        $scope.deleteBot = function(bot) {
            notificationService.showConfirmationDialog({
                title: "Delete bot?",
                text: "Do you want to delete the bot '" + bot.name + "'",
                confirmButtonText: "Delete"
            }).then(function(shouldDelete) {

                if (shouldDelete) {
                    deleteBot(bot.id);
                }
            });
        };

        $http({
                method: "GET",
                url: gosuArena.url.createAbsoluteWithCacheBusting("/api/bots?currentUser=true")
            })
            .then(function(response) {
                var bots = response.data;

                for (var i = 0; i < bots.length; i++) {
                    // Strip the time part
                    bots[i].createdDate = bots[i].createdDate.slice(0, 10);
                }

                $scope.bots = bots;
            }, function(e) {
                notificationService.showUnexpectedErrorMessage(e);
            });
    }
]);