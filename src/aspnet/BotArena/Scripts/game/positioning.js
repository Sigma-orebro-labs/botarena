var gosuArena = gosuArena || {};
gosuArena.positioning = gosuArena.positioning || {};

gosuArena.positioning.resolveCollisions = function(bots, collisionDetector) {
    var collidingBots = bots.filter(function(bot) {
        return collisionDetector.hasCollided(bot);
    });

    gosuArena.positioning.randomizeBotPositions(collidingBots, collisionDetector);
};

gosuArena.positioning.randomizeBotPositions = function(bots, collisionDetector) {
    bots.forEach(function (bot) {
        do {
            bot.teleportToRandomLocation();
        } while (collisionDetector.hasCollided(bot));
    });
}
