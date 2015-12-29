angular.module('menuApp').controller('MainController', ['$scope', '$state', function ($scope, $state) {
    $scope.menuItems = [{
        label: 'Create bot',
        someprop: 19
    },{
        label: 'Play FFA Match'
    }, {
        label: 'Play Team Match',
        someprop: 19
    }, {
        label: 'Your bots',
        someprop: 19
    }, {
        label: 'Gosu Bot Arena',
        someprop: 19
    }, {
        label: 'Documentation',
        someprop: 19
    }, {
        label: 'What is new?',
        someprop: 19
    }, {
        label: 'Users (ADMIN ONLY)',
        someprop: 19
    }];

    $scope.toggleMenu = function () {

        if ($state.is("none")) {
            $state.go("main-menu");
        } else {
            $state.go("none");
        }
    };
}]);