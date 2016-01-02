angular.module('menuApp').controller('editorCtrl',
    ['$scope', '$stateParams', '$http', '$window', 'notificationService', 'matchSetupService',
        function ($scope, $stateParams, $http, $window, notificationService, matchSetupService) {

            function saveChanges(success) {
                $http({
                    method: "PUT",
                    url: gosuArena.url.createAbsolute("/api/bots/" + $stateParams.botId),
                    data: $scope.bot
                })
                    .then(function () {
                        $scope.editorForm.$setPristine();
                        success();
                    }, function (e) {
                        notificationService.showUnexpectedErrorMessage(e);
                    });
            }

            $scope.trainingBots = [];
            
            function hasUnsavedEditorChanges() {
                return $scope.editorForm.$dirty;
            }

            function createStartMatchUrl() {

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

            function startMatch() {
                $window.open(createStartMatchUrl());
            }

            $scope.startTrainingMatch = function () {

                if (hasUnsavedEditorChanges()) {
                    notificationService.showConfirmationDialog({
                        title: "Save changes?",
                        text: "Do you want to save the changes you have made to your bot before starting the training match?",
                        confirmButtonText: "Save and start!",
                        cancelButtonText: "Start without saving"
                    }).then(function (shouldSaveChanges) {

                        if (shouldSaveChanges) {
                            saveChanges(function() {
                                notificationService.showSuccessMessage("Bot saved", "Your bot has been saved!");
                                startMatch();
                            });
                        } else {
                            startMatch();
                        }
                    });
                } else {
                    startMatch(false);
                }
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

            $scope.save = function () {
                saveChanges(function() {
                    notificationService.showSuccessMessage("Your changes have been saved");
                });
            };
        }
]);