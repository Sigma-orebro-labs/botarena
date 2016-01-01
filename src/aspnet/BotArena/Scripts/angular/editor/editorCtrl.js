angular.module('menuApp').controller('editorCtrl',
    ['$scope', '$stateParams', '$http', 'notificationService', 'matchSetupService',
        function ($scope, $stateParams, $http, notificationService, matchSetupService) {

            $scope.trainingBots = [];

            $scope.createStartMatchUrl = function () {

                var selectedBots = $scope.trainingBots.filter(function(bot) {
                    return bot.isSelected;
                });

                if ($scope.bot) {
                    selectedBots.push($scope.bot);
                }

                return matchSetupService.createStartMatchUrl(
                    [ selectedBots ], {
                        isTeamSetup: false,
                        isTraining: true
                    });
            };

            $scope.toggleSelection = function(bot) {
                bot.isSelected = !bot.isSelected;
            };

            $http({
                    method: "GET",
                    url: gosuArena.url.createAbsolute("/api/bots/" + $stateParams.botId)
                })
                .then(function(response) {
                    $scope.bot = response.data;
                }, function(e) {
                    notificationService.showUnexpectedErrorMessage(e);
                });

            $http({
                    method: "GET",
                    url: gosuArena.url.createAbsolute("/api/bots/" + $stateParams.botId + "/trainingbots")
                })
                .then(function(response) {
                    $scope.trainingBots = response.data;
                }, function(e) {
                    notificationService.showUnexpectedErrorMessage(e);
                });

            $scope.save = function() {
                $http({
                    method: "PUT",
                    url: gosuArena.url.createAbsolute("/api/bots/" + $stateParams.botId),
                    data: $scope.bot
                })
                .then(function () {
                    notificationService.showSuccessMessage("Your changes have been saved");
                        $scope.editorForm.$setPristine();
                    }, function (e) {
                    notificationService.showUnexpectedErrorMessage(e);
                });
            };
        }
]);