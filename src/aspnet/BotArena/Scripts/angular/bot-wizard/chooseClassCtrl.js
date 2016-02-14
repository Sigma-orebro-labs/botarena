angular.module('menuApp').controller('chooseClassCtrl', ['$scope', function($scope) {

        $scope.botClasses = gosuArena.factories.modifiers.getCurrentConfig().filter(function(x) {
            return x.type === "class";
        });

        $scope.isSelected = function(botClass) {
            return $scope.$parent.bot.className === botClass.id;
        }

        $scope.selectClass = function (selectedClass) {
            
            $scope.$parent.bot.className = selectedClass.id;
            $scope.$parent.changeModelTo(selectedClass.id);

        }
    }
]);