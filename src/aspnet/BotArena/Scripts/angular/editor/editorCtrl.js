angular.module('menuApp').controller('editorCtrl',
    ['$scope', '$stateParams', '$http', 'notificationService',
        function ($scope, $stateParams, $http, notificationService) {

            //var textArea = document.getElementById("editor");
            //var editor = CodeMirror.fromTextArea(textArea, {
            //    lineNumbers: true,
            //    mode: "javascript",
            //    gutters: ["CodeMirror-lint-markers"],
            //    lint: true,
            //    matchBrackets: true,
            //    highlightSelectionMatches: { showToken: /\w/ },
            //    styleActiveLine: true
            //});

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
                .then(function (response) {
                    $scope.trainingBots = response.data;
                }, function (e) {
                    notificationService.showUnexpectedErrorMessage(e);
                });
        }
]);