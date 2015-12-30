angular.module('menuApp').controller('loginCtrl', ['$scope','$http', '$state', function ($scope, $http, $state) {

            $scope.model = {
                UserName: "",
                Password: "",
                RememberMe: false
            };

            $scope.isProcessingLoginRequest = false;
            $scope.hasLoginFailed = false;

            $scope.login = function () {

                $scope.isProcessingLoginRequest = true;

                console.log("loginMethod");
                $http({
                    method: "POST",
                    url: gosuArena.url.createAbsolute("/api/AuthSession/"),
                    data: $scope.model
                }).then(function() {
                    $state.go("none");
                    console.log("login was successful");

                    $scope.isProcessingLoginRequest = false;
                }, function(e) {
                    if (e.status === 401) {
                        alert("Username and/or password was incorrect");
                    }

                    $scope.hasLoginFailed = true;
                    $scope.isProcessingLoginRequest = false;
                });
            };
        }
    ]
);