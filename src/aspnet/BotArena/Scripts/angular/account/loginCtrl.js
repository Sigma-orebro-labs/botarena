angular.module('menuApp').controller('loginCtrl', ['$scope','$http', '$state', 'authService', function ($scope, $http, $state, authService) {

            $scope.isProcessingLoginRequest = false;
            $scope.invalidCredentials = false;

            $scope.login = function () {

                authService.login($scope.username, $scope.password, $scope.rememberMe)
                    .then(function(user) {
                        console.log("login successful");

                        $state.go("none");
                        $scope.currentUser = user;
                    }, function(e) {
                        if (e.invalidCredentials) {
                            $scope.invalidCredentials = true;
                        } else {
                            // unexpected error
                        }
                    }).finally(function() {
                        $scope.isProcessingLoginRequest = false;
                    });
            };
        }
    ]
);