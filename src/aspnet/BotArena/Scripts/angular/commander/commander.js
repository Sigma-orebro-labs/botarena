var gosuArena = gosuArena || {};

gosuArena.noop = function () { };

angular.module('commander', ['ui.router', 'toaster', 'oitozero.ngSweetAlert'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/rooms'); // default route when no other matching url is found

        $stateProvider
            .state('none', {
                url: "/"
            })
            .state('game-room-list', {
                url: '/rooms',
                templateUrl: gosuArena.url.createAbsoluteWithCacheBusting('/Scripts/angular/commander/views/game-room-list.html'),
                controller: 'gameRoomListController'
            })
            .state('game-room', {
                url: '/rooms/:roomId',
                templateUrl: gosuArena.url.createAbsoluteWithCacheBusting('/Scripts/angular/commander/views/game-room.html'),
                controller: 'gameRoomController'
            })
            .state('bot-commander', {
                url: '/rooms/:roomId/bot/:botId',
                templateUrl: gosuArena.url.createAbsoluteWithCacheBusting('/Scripts/angular/commander/views/bot-commander.html'),
                controller: 'botCommanderController'
            });
    });
