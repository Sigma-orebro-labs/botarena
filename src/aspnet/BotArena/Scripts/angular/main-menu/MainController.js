angular.module('menuApp').controller('MainController', ['$scope', '$state', 'authService', 'notificationService', function ($scope, $state, authService, notificationService) {

    $scope.logOff = function () {
        authService.logOff()
            .then(function () {
                notificationService.showSuccessMessage("Signed out", "You have been signed out");
                $state.go("none");
            }, function(e) {
                notificationService.showUnexpectedErrorMessage(e);
            });
    };

    $scope.toggleMenu = function () {

        if ($state.is("none")) {
            $state.go("main-menu");
        } else {
            $state.go("none");
        }
    };

    $scope.isLoggedIn = function () {
        return authService.isLoggedIn();
    }

    $scope.docsUrl = gosuArena.url.createAbsolute("/docs");
}]);