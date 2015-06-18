var botArena = angular.module('botArena', ['ngRoute']);

botArena.config(function ($routeProvider) {

    $routeProvider
        .when('/',
        {
            controller: 'matchController',
            templateUrl: 'js/angular/templates/match/play.html'
        }).otherwise({ redirectTo: '/' });
});