angular.module('menuApp').controller('chooseArmorCtrl', ['$scope', function($scope) {

            $scope.availableArmor = gosuArena.factories.modifiers.getCurrentConfig().filter(function(x) {
                return x.type === "armor";
            });

            $scope.isSelected = function (armor) {
                return $scope.$parent.bot.armor === armor.id;
            };

            $scope.selectArmor = function (selectedArmor) {

                // TODO: Update the 3d model in some way

                $scope.$parent.bot.armor = selectedArmor.id;
            };

        }
]
);