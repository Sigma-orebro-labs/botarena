var botarena = angular.module('botarena', ['ngRoute']);

botarena.config(function ($routeProvider) {

    $routeProvider
        .when('/SceneEditor',
        {
            controller: 'SceneEditorController',
            templateUrl: 'Content/angular/templates/scene-editor.html'
        }).otherwise({ redirectTo: '/SceneEditor' });
});