var gosuArena = gosuArena || {};
gosuArena.specs = gosuArena.specs || {};
gosuArena.specs.game = gosuArena.specs.game || {};

gosuArena.specs.game.addBot = function (options) {
    options = options || {};

    options.startPosition = options.startPosition || {};
    options.startPosition.x = options.startPosition.x || 0;
    options.startPosition.y = options.startPosition.y || 0;
    options.startPosition.angle = options.startPosition.angle || 0;

    options.tick = options.tick || function() {};
    options.onHitByBullet = options.onHitByBullet || function() {};

    gosuArena.initiateBotRegistration({
        id: options.id || 1,
        teamId: options.teamId
    }, function() {
        gosuArena.register({
            tick: options.tick,
            onHitByBullet: options.onHitByBullet,
            onCollision: options.onCollision,
            commands: options.commands,
            options: {
                startPosition: options.startPosition,
                botClass: options.botClass,
                equipment: options.equipment,
                augmentations: options.augmentations,
                rethrowScriptErrors: true
            }
        });
    });
};

gosuArena.specs.game.cleanup = function() {
    gosu.eventAggregator.unsubscribeAll();

    gosuArena.engine.reset();
};

gosuArena.specs.game.initializeWorld = function (listeners) {
    gosuArena.engine.initializeWorld({
        listeners: listeners
    });
}

gosuArena.specs.game.startGame = function (clock, options) {

    options = options || {};

    if (options.isTraining !== false) {
        options.isTraining = true;
    }

    gosuArena.engine.start(clock, options);
};

gosuArena.specs.createGameSetup = function() {
    var setup = {
        clock: null,
        arenaState: null
    };

    var arenaStateInterceptor = {
        initialize: function (state) {
            setup.arenaState = state;
        }
    };

    setup.startGame = function (options) {
        gosuArena.specs.game.startGame(setup.clock, options);
    }

    setup.initializeModifiers = gosuArena.factories.modifiers.initialize;

    setup.addBot = gosuArena.specs.game.addBot;

    setup.beforeEach = function() {

        jasmine.addMatchers(gosuArena.specs.matchers);

        setup.clock = gosuArena.gameClock.createFake();

        gosuArena.specs.game.cleanup();

        gosuArena.specs.game.initializeWorld([arenaStateInterceptor]);
    };

    setup.afterEach = function() {
        setup.arenaState.unsubscribeAllEventListeners();
    };

    return setup;
};