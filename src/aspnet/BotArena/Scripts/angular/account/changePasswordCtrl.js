angular.module('menuApp').controller('changePasswordCtrl', ['$scope', '$http', '$state', 'notificationService', function($scope, $http, $state, notificationService) {

        $scope.changePassword = function() {

            if ($scope.newPassword !== $scope.confirmPassword) {
                notificationService.showErrorMessage("Invalid password", "The password confirmation does not match the new password");
                return;
            }

            $http({
                method: "PUT",
                url: gosuArena.url.createAbsolute('api/accounts/current/password'),
                data: {
                    oldPassword: $scope.oldPassword,
                    newPassword: $scope.newPassword,
                    confirmPassword: $scope.confirmPassword
                }
            }).then(function() {
                notificationService.showSuccessMessage("Password changed", "Your password has been changed!");
                $state.go("none");
            }, function (e) {
                if (e.status === 401) {
                    notificationService.showErrorMessage("Invalid password", "The old password supplied is incorrect");
                } else {
                    notificationService.showUnexpectedErrorMessage(e);
                }
            });
        }
    }
]);