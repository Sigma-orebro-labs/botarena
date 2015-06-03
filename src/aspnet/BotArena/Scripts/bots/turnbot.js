gosuArena.register({
    tick: function (actionQueue, status) {

        var seenEnemies = status.seenBots.filter(function(bot) {
            return !bot.teamId || bot.teamId != status.teamId;
        });

        if (seenEnemies.length && seenEnemies.length == status.seenBots.length) {
            actionQueue.clear();
            
            if (status.roundsUntilWeaponIsReady <= 0) {
                actionQueue.fire();
            }
        } else {
            actionQueue.turn(status.actionsPerRound);
        }
    }
});
