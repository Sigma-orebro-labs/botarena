angular.module('menuApp').controller('registerCtrl', ['$scope', '$http', '$state', 'notificationService', 'authService', function($scope, $http, $state, notificationService, authService) {

        $scope.register = function() {

            if ($scope.model.password !== $scope.model.confirmPassword) {
                notificationService.showErrorMessage("Invalid password", "The password confirmation does not match the password");
                return;
            }

            $http({
                method: "POST",
                url: gosuArena.url.createAbsolute('api/Accounts'),
                data: $scope.model
            }).then(function() {
                notificationService.showSuccessMessage("Account created", "Your account has been created! Signing in...");
                $state.go("none");

                authService.login($scope.model.username, $scope.model.password, false)
                    .then(function() {
                        notificationService.showSuccessMessage("Account created", "You have been signed in!");
                    }, function() {
                        notificationService.showUnexpectedErrorMessage(e);
                        $state.go("log-in");
                    });
            }, function(e) {
                if (e.status === 409) {
                    notificationService.showErrorMessage("Username taken", "The username is already taken, please try another username.");
                } else {
                    notificationService.showUnexpectedErrorMessage(e);
                }
            });
        }
    }
]);