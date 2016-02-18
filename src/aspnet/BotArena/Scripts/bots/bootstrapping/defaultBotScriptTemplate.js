// Feel free to add code out here. Your code is running within its own scope so you wont
// have naming conflicts with other bots

gosuArena.register({
    tick: function (actionQueue, status, augmentations) {

        // Do something interesting here... for example:

        if (status.enemiesOnTarget.length > 0 && status.canFire()) {

            // Clear the action queue to make sure that the shot is fired immediately.
            // Otherwise there might be lots of move or rotate actions, or something like that,
            // on the queue which causes the fire command to be delayed for several turns.
            actionQueue.clear();
            actionQueue.fire();
        }

        // Example of how to activate your augmentation
%AUGMENTATION_SNIPPET%

        // Example bot behaviour. Check out the documentation for other examples.
%BEHAVIOUR_SNIPPET%

    },
    onHitByBullet: function (actionQueue, status, augmentations, eventArgs) {
        
        // This will be called if your bot is hit by a bullet from another bot

    },
    onCollision: function (actionQueue, status, augmentations) {

        // This will be called if your bot collides with a wall or another bot

    },
    // To change the class, equipment or augmentation of your bot, check out the documentation
    // for a complete listing of the available equipment, classes, augmentations etc.
    options: { 
        color: "%COLOR_HEX_CODE%",
        botClass: "%BOT_CLASS%",
        equipment: [%EQUIPMENT%],
        augmentations: [%AUGMENTATIONS%]
    }
});
