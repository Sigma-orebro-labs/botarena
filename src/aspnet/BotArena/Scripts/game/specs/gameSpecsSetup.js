﻿var gosuArena = gosuArena || {};
gosuArena.specs = gosuArena.specs || {};
gosuArena.specs.game = gosuArena.specs.game || {};

gosuArena.specs.game.addBot = function(options) {
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
            options: {
                startPosition: options.startPosition,
                botClass: options.botClass
            }
        });
    });
};

gosuArena.specs.game.cleanup = function() {
    gosu.eventAggregator.unsubscribeAll("matchEnded");
    gosuArena.engine.reset();
};

gosuArena.specs.game.startGame = function(clock, listeners) {
    gosuArena.engine.start(clock, {
        isTraining: true,
        listeners: listeners
    });
};