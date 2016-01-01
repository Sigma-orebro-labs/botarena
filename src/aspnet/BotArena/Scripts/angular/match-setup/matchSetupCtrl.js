angular.module('menuApp').controller('matchSetupCtrl', ['$scope', '$state', '$http', 'notificationService', function($scope, $state, $http, notificationService) {

        $scope.isTeamSetup = $state.is("teamsetup");

        $scope.bots = [];
        $scope.rosters = [];

        var maxTeamCount = 4;

        for (var i = 1; i <= maxTeamCount; i++) {
            $scope.rosters.push({
                selectedBots: [],
                isActive: i === 1, // Set the first tab as active by default
                identifier: 'team' + i,
                name: 'Team ' + i
            });
        }

        $scope.getCurrentRoster = function() {
            for (var j = 0; j < $scope.rosters.length; j++) {
                if ($scope.rosters[j].isActive) {
                    return $scope.rosters[j];
                }
            }

            return null;
        };

        $scope.setCurrentRoster = function(selectedRoster) {
            $scope.rosters.forEach(function(roster) {
                roster.isActive = roster === selectedRoster;
            });
        }

        $scope.rosterSelectedBots = function() {
            return $scope.getCurrentRoster().selectedBots;
        };

        $scope.isSelectionEmpty = function() {
            return $scope.getCurrentRoster().selectedBots.length === 0;
        };

        $scope.isResultLimited = function() {
            return false; // Limiting the result is not implemented yet in the angular version, but exists in the original knockout one
        };

        $scope.addBot = function(bot) {
            $scope.getCurrentRoster().selectedBots.push(bot);
            notificationService.showSuccessMessage("Bot added", bot.name + " was added to the match");
        };

        $scope.removeBot = function(bot) {
            notificationService.showSuccessMessage("Bot removed", bot.name + " was removed from the match");

            var index = $scope.getCurrentRoster().selectedBots.indexOf(bot);
            $scope.selectedBots.splice(index, 1);
        };

        $scope.startMatchUrl = function () {

            var rosterQueryValues = [];

            for (var j = 0; j < $scope.rosters.length; j++) {

                if ($scope.rosters[j].selectedBots.length === 0) {
                    continue;
                }

                var selectedBotNames = $scope.rosters[j].selectedBots.map(function (bot) { return bot.name });
                var rosterList = selectedBotNames.join(",");

                var rosterQueryValue = encodeURIComponent("rosters[" + j + "]") + "=" + encodeURIComponent(rosterList);

                rosterQueryValues.push(rosterQueryValue);
            }

            var rosterQueryString = rosterQueryValues.join("&");

            var isTeamValue = $scope.isTeamSetup ? "true" : "false";

            return gosuArena.url.createAbsolute("/Match/Play?" + rosterQueryString + "&isTeam=" + isTeamValue);
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