angular.module('menuApp').controller('chooseAugmentationsCtrl', ['$scope', function($scope) {

        $scope.availableAugmentations = gosuArena.factories.augmentations.getAugmentations();

        $scope.isSelected = function(augmentation) {
            return $scope.$parent.bot.augmentation === augmentation.id;
        };

        $scope.selectAugmentation = function (selectedAugmentation) {

            // TODO: Update the 3d model in some way

            $scope.$parent.bot.augmentation = selectedAugmentation.id;
        };
    }
]);