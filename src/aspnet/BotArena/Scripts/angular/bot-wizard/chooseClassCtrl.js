angular.module('menuApp').controller('chooseClassCtrl', ['$scope', function($scope) {

        $scope.botClasses = gosuArena.factories.modifiers.getCurrentConfig().filter(function(x) {
            return x.type === "class";
        });

        $scope.isSelected = function(botClass) {
            return $scope.$parent.bot.className === botClass.id;
        }

        $scope.selectClass = function (selectedClass) {
            // This should probably be made more dynamic, for example by including the path 
            // to the babylon model in the JSON config to avoid having to hard code these cases here.
            if (selectedClass.type === "tank") {
                $scope.$parent.showTankModel();
            } else {
                $scope.$parent.showNinjaModel();
            } 

            $scope.$parent.bot.className = selectedClass.id;
        }
    }
]);