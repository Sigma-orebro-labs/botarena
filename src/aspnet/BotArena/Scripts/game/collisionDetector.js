var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createCollisionDetector = function(arenaState) {

    function collidingBots(bot) {
        var botRectangle = bot.rectangle();

        return arenaState.livingBots().filter(function (otherBot) {
            return otherBot !== bot &&
                botRectangle.overlaps(otherBot.rectangle());
        });
    }

    function collidingWalls(bot) {
        var botRectangle = bot.rectangle();

        return arenaState.terrain.filter(function (terrain) {
            return botRectangle.overlaps(terrain.rectangle());
        });
    }

    function hasCollided(bot) {
        return collidingBots(bot).length > 0 ||
            collidingWalls(bot).length > 0;
    }

    function hitBullets(bot) {
        var botRectangle = bot.rectangle();

        return arenaState.bullets.filter(function (bullet) {
            return botRectangle.overlaps(bullet.rectangle());
        });
    }

    function bulletsHitTerrain(terrain) {
        return arenaState.bullets.filter(function (bullet) {
            return terrain.rectangle().overlaps(bullet.rectangle());
        });
    }

    function seenBots(bot) {
        return arenaState.livingBots().filter(function (otherBot) {
            return otherBot !== bot &&
                bot.sightRectangle().overlaps(otherBot.rectangle());
        });
    }

    function botsInFieldOfView(bot) {

        var fieldOfVisionRectangle = bot.fieldOfVisionRectangle();

        return arenaState.livingBots().filter(function (otherBot) {
            if (otherBot === bot) {
                return false;
            }

            return fieldOfVisionRectangle.overlaps(otherBot.rectangle());
        });
    }

    function canPerformMoveAction(bot, moveAction) {
        var canPerformAction = false;

        bot.snapshotPosition();

        moveAction();

        var canPerformAction = !hasCollided(bot);

        bot.restoreSnapshot();

        return canPerformAction;
    }

    return {
        collidingBots: collidingBots,
        collidingWalls: collidingWalls,
        hasCollided: hasCollided,
        hitBullets: hitBullets,
        bulletsHitTerrain: bulletsHitTerrain,
        seenBots: seenBots,
        botsInFieldOfView: botsInFieldOfView,
        canPerformMoveAction: canPerformMoveAction
    };
};
