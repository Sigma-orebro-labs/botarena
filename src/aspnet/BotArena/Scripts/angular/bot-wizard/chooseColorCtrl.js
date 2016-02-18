angular.module('menuApp').controller('chooseColorCtrl', ['$scope', 'colorpickerService', function ($scope, colorpickerService) {
    colorpickerService.initialize($scope.bot.colorHexCode, function (hex) {
        $scope.bot.colorHexCode = hex;
        $scope.$parent.updateMeshColor($scope.bot.className);
    });
    }
]);