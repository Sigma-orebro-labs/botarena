angular.module('menuApp').controller('editorCtrl',
    ['$scope', '$stateParams', '$http', 'notificationService',
        function ($scope, $stateParams, $http, notificationService) {

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