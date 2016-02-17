// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status, augmentations) {

        // Clear the action queue to make sure there are no
        // actions remaining in the queue. This ensures that
        // the actions queued here will actually be executed,
        // and not just put at the end of the queue.
        actionQueue.clear();

        // Do something interesting here... for example:

        if (status.enemiesOnTarget.length > 0 && status.canFire()) {
            actionQueue.clear();
            actionQueue.fire();
        }

        // Example of how to activate your augmentation
%AUGMENTATION_SNIPPET%

        actionQueue.turn(1);
        actionQueue.forward(1);
    },
    onHitByBullet: function (actionQueue, status, augmentations, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    onCollision: function (actionQueue, status, augmentations) {

        // This will be called if your bot collides with a wall or another bot

    },
    options: {
        color: "%COLOR_HEX_CODE%",
        botClass: "%BOT_CLASS%",
        equipment: [%EQUIPMENT%],
        augmentations: [%AUGMENTATIONS%]
    }
});
