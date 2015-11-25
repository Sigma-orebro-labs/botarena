angular.module('menuApp', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/main-menu'); // default route when no other matching url is found

        $stateProvider
            .state('main-menu', {
                url: '/main-menu',
                templateUrl: 'Scripts/angular/main-menu/main-menu.html',
                controller: 'MainController',
                controllerAs: 'main'
            })
            .state('log-in', {
                url: '/login',
                templateUrl: 'Scripts/angular/account/Login.html',
                controller: 'loginCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'Scripts/angular/account/Register.html',
                controller: 'registerCtrl'
            })
            .state('bot-wizard', {
                url: '/bot-wizard',
                abstract: true,
                templateUrl: 'Scripts/angular/bot-wizard/BotWizardLayout.html',
                controller: 'botWizardCtrl',
                controllerAs: 'wizard'
            })
            .state('bot-wizard.choose-class', {
                url: '/choose-class',
                templateUrl: 'Scripts/angular/bot-wizard/ChooseClass.html',
                controller: 'chooseClassCtrl',
                controllerAs: 'class'
            })
            .state('bot-wizard.choose-equipment', {
                url: '/choose-equipment',
                templateUrl: 'Scripts/angular/bot-wizard/ChooseEquipment.html',
                controller: 'chooseEquipmentCtrl',
                controllerAs: 'equipment'
            })
            .state('bot-wizard.choose-color', {
                url: '/choose-color',
                templateUrl: 'Scripts/angular/bot-wizard/ChooseColor.html',
                controller: 'chooseColorCtrl',
                controllerAs: 'color'
            })
            .state('bot-wizard.enter-bot-name', {
                url: '/enter-bot-name',
                templateUrl: 'Scripts/angular/bot-wizard/EnterBotName.html',
                controller: 'enterBotNameCtrl',
                controllerAs: 'enterName'
            })
            .state('bot-wizard.enter-email', {
                url: 'enter-email',
                templateUrl: 'Scripts/angular/bot-wizard/EnterEmail.html',
                controller: 'enterEmailCtrl',
                controllerAs: 'enterEmail'
            });
    });
    

angular.module('menuApp').directive('ngEsc', function () {
    return function (scope, element, attrs) {
        element.bind("keypress keyup", function (event) {
            if (event.which === 27) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEsc);
                });
                event.preventDefault();
            }
        });
    };

});
