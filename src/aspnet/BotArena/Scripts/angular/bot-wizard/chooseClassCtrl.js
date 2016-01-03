angular.module('menuApp').controller('chooseClassCtrl', ['$scope', function($scope) {

        $scope.ninja = function() {
            $scope.$parent.showNinjaModel();
            $scope.$parent.bot.className = "Ninja";
        };

        $scope.tank = function() {
            $scope.$parent.showTankModel();
            $scope.$parent.bot.className = "Tank";
        };

        $scope.normal = function() {
            $scope.$parent.showNormalModel();
            $scope.$parent.bot.className = "Normal";
        };
    }
]);