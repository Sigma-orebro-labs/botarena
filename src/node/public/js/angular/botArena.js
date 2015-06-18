var botArena = angular.module('botArena', ['ngRoute']);

botArena.config(function ($routeProvider) {

    $routeProvider
        .when('/',
        {
            controller: 'matchController',
            templateUrl: 'js/angular/templates/play.html'
        }).otherwise({ redirectTo: '/SceneEditor' });
});