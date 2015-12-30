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
                    url: gosuArena.url.createAbsolute('/api/AuthSession/'),
                    data: $scope.model
                }).then(function () {
                    console.log("login was successful");
                }, function (e) {

                    if (e.status === 401) {
                        alert("Username and/or password was incorrect");
                    }

                    console.log(JSON.stringify(e));
                });
            };
        }
    ]
);