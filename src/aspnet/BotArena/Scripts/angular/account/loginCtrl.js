angular.module('menuApp').controller('loginCtrl', ['$scope','$http', '$state', 'authService', 'notificationService', function ($scope, $http, $state, authService, notificationService) {

            $scope.isProcessingLoginRequest = false;
            $scope.invalidCredentials = false;

            $scope.login = function () {

                authService.login($scope.username, $scope.password, $scope.rememberMe)
                    .then(function(user) {
                        console.log("login successful");

                        $state.go("none");
                        $scope.currentUser = user;

                        notificationService.showSuccessMessage("Signed in", "You have been signed in!");
                    }, function(e) {
                        if (e.invalidCredentials) {
                            $scope.invalidCredentials = true;

                            notificationService.showErrorMessage("Sign in failed", "The username/password was incorrect");
                        } else {
                            notificationService.showUnexpectedErrorMessage(e);
                        }
                    }).finally(function() {
                        $scope.isProcessingLoginRequest = false;
                    });
            };
        }
    ]
);