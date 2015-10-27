var gosuArena = gosuArena || {};

gosuArena.noop = function () { };

var app = angular.module("commander", ["ngRoute"]);

app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/gamerooms/', {
            templateUrl: gosuArena.pageData.gameRoomListUrl,
            controller: 'gameRoomListController'
        })
        .when('/gamerooms/:id', {
            templateUrl: gosuArena.pageData.gameRoomUrl,
            controller: 'gameRoomController'
        })
        .when('/gamerooms/:gameRoomId/bot/:botId', {
            templateUrl: gosuArena.pageData.botCommanderUrl,
            controller: 'botCommanderController'
        })
        .otherwise({
            redirectTo: '/gamerooms'
        });
}]);