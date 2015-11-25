angular.module('menuApp').controller('loginCtrl', ['$scope','$http', function ($scope, $http) {

            $scope.model = {
                UserName: "",
                Password: "",
                RememberMe: false
            };

            $scope.login = function() {
                console.log("loginMethod");
                $http({
                    method: 'POST',
                    url: 'http://localhost/BotArena/Account/Login',
                    data: { model: $scope.model, returnUrl: 'http://google.se/' }
                }).success(function loginSuccessCallback() {
                    console.log("login was successful");
                });
            };
        }
    ]
);