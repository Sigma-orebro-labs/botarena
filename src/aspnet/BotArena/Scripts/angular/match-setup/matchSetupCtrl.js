angular.module('menuApp').controller('matchSetupCtrl', ['$scope', '$http', 'notificationService', function($scope, $http, notificationService) {

        $scope.bots = [];
        $scope.selectedBots = [];

        $scope.isSelectionEmpty = function() {
            return $scope.selectedBots.length === 0;
        };

        $scope.isResultLimited = function() {
            return false; // Limiting the result is not implemented yet in the angular version, but exists in the original knockout one
        };

        $scope.addBot = function(bot) {
            $scope.selectedBots.push(bot);
            notificationService.showSuccessMessage("Bot added", bot.name + " was added to the match");
        }

        $scope.removeBot = function (bot) {
            notificationService.showSuccessMessage("Bot removed", bot.name + " was removed from the match");

            var index = $scope.selectedBots.indexOf(bot);
            $scope.selectedBots.splice(index, 1);
        }

        $scope.startMatchUrl = function () {
            var selectedBotNames = $scope.selectedBots.map(function (bot) { return bot.name });
            var rosterList = selectedBotNames.join(',');
            return gosuArena.url.createAbsolute("/Match/Play?rosters[0]=" + encodeURIComponent(rosterList) + "&isTeam=false");
        };

        $http({
                method: "GET",
                url: gosuArena.url.createAbsolute("/api/bots")
            })
            .then(function(response) {
                $scope.bots = response.data;
            }, function(e) {
                notificationService.showUnexpectedErrorMessage(e);
            });
    }
]);