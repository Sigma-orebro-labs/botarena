// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status) {

        // Do something interesting here... for example:

        if (status.seenEnemies.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }
        
        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    options: {
        color: "#71d40e"
    }
});
