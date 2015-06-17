var botarena = angular.module('botarena', ['ngRoute']);

botarena.config(function ($routeProvider) {

    $routeProvider
        .when('/',
        {
            controller: 'matchController',
            templateUrl: 'Content/angular/templates/scene-editor.html'
        })
        .when('/SceneEditor',
        {
            controller: 'SceneEditorController',
            templateUrl: 'Content/angular/templates/scene-editor.html'
        }).otherwise({ redirectTo: '/SceneEditor' });
});