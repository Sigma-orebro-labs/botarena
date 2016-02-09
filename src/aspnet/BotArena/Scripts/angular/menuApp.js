    angular.module('menuApp', ['ui.router', 'toaster', 'ui.codemirror', 'oitozero.ngSweetAlert'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/'); // default route when no other matching url is found

        $stateProvider
            .state('none', {
                url: "/"
            })
            .state('main-menu', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/main-menu/main-menu.html'),
                controller: 'MainController',
                controllerAs: 'main'
            })
            .state('log-in', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/account/Login.html'),
                controller: 'loginCtrl'
            })
            .state('register', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/account/Register.html'),
                controller: 'registerCtrl'
            })
            .state('changepassword', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/account/ChangePassword.html'),
                controller: 'changePasswordCtrl'
            })
            .state('ffasetup', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/match-setup/setup.html'),
                controller: 'matchSetupCtrl'
            })
            .state('teamsetup', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/match-setup/setup.html'),
                controller: 'matchSetupCtrl'
            })
            .state('mybots', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bots/list.html'),
                controller: 'botListCtrl'
            })
            .state('editbot', {
                url: '/edit/:botId',
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/editor/editor.html'),
                controller: 'editorCtrl'
            })
            .state('bot-wizard', {
                abstract: true,
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bot-wizard/BotWizardLayout.html'),
                controller: 'botWizardCtrl',
                controllerAs: 'wizard'
            })
            .state('bot-wizard.choose-class', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bot-wizard/ChooseClass.html'),
                controller: 'chooseClassCtrl',
                controllerAs: 'class'
            })
            .state('bot-wizard.choose-weapon', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bot-wizard/ChooseWeapon.html'),
                controller: 'chooseWeaponCtrl',
                controllerAs: 'weapon'
            })
            .state('bot-wizard.choose-equipment', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bot-wizard/ChooseEquipment.html'),
                controller: 'chooseEquipmentCtrl',
                controllerAs: 'equipment'
            })
            .state('bot-wizard.choose-augmentations', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bot-wizard/ChooseAugmentations.html'),
                controller: 'chooseAugmentationsCtrl',
                controllerAs: 'augmentations'
            })
            .state('bot-wizard.choose-color', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bot-wizard/ChooseColor.html'),
                controller: 'chooseColorCtrl',
                controllerAs: 'color'
            })
            .state('bot-wizard.enter-bot-name', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bot-wizard/EnterBotName.html'),
                controller: 'enterBotNameCtrl',
                controllerAs: 'enterName'
            })
            .state('bot-wizard.enter-email', {
                templateUrl: gosuArena.url.createAbsolute('/Scripts/angular/bot-wizard/EnterEmail.html'),
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
