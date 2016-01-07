angular.module('menuApp').controller('chooseWeaponCtrl', ['$scope', function($scope) {

        $scope.availableWeapons = gosuArena.factories.modifiers.getCurrentConfig().filter(function (x) {
            return x.type === "weapon";
        });

        $scope.isSelected = function(weapon) {
            return $scope.$parent.bot.weapon === weapon.id;
        };

        $scope.selectWeapon = function (selectedWeapon) {

            // TODO: Update the 3d model in some way

            $scope.$parent.bot.weapon = selectedWeapon.id;
        };
    }
]);