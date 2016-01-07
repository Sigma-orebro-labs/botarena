angular.module('menuApp').controller('chooseEquipmentCtrl', ['$scope', function($scope) {

        $scope.availableEquipment = gosuArena.factories.modifiers.getCurrentConfig().filter(function (x) {
            return x.type === "bonusGear";
        });

        $scope.isSelected = function(equipment) {
            return $scope.$parent.bot.equipment === equipment.id;
        };
        $scope.selectEquipment = function(selectedEquipment) {

            // TODO: Update the 3d model in some way

            $scope.$parent.bot.equipment = selectedEquipment.id;
        };
    }
]);