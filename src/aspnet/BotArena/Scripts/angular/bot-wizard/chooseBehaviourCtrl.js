angular.module('menuApp').controller('chooseBehaviourCtrl', ['$scope', function($scope) {

    $scope.availableBehaviours = [
        {
            id: "turnbot",
            name: "Turnbot",
            description: "Simple bot that stays in one place and rotates around and around."
        }, {
            id: "waller",
            name: "Waller",
            description: "Moves to the east wall, aiming west, and moving up and down along that wall."
        }, {
            id: "circler",
            name: "Circler",
            description: "Moves around in a circle."
        }, {
            id: "randomizer",
            name: "Randomizer",
            description: "Moves randomly around the map."
        }
    ];

        $scope.isSelected = function(behaviour) {
            return $scope.$parent.bot.behaviour === behaviour.id;
        };

        $scope.selectBehaviour = function (selectedBehaviour) {
            $scope.$parent.bot.behaviour = selectedBehaviour.id;
        };
    }
]);