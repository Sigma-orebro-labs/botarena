angular.module('menuApp').controller('registerCtrl', ['$scope', '$http', function($scope, $http) {

        $scope.model = {
            UserName: "",
            Password: "",
            ConfirmPassword: "",
            Email: ""
        }

        $scope.register = function() {

            $http({
                method: "POST",
                url: 'http://localhost/BotArena/Account/Register',
                data: { model: $scope.model }
            })
            .success(function registerSuccessfulCallback(response) {
                console.log(response);
            })
            .error(function registerFailedCallback(response) {
                console.log(response);
            });
        }
    }
]);