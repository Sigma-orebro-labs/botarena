var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

gosuArena.factories.augmentations.createRepair = function(botProperties, exposedMethods) {

    return gosuArena.factories.augmentations.createBaseAugmentation(
        botProperties,
        exposedMethods,
        {
            roundCount: 600,
            tick: function(augmentation) {
                if (augmentation.roundsRemaining() % 20 === 0) {
                    var newHealth = botProperties.health + 1;

                    if (newHealth < botProperties.maxHealth) {
                        exposedMethods.setHealth(newHealth);
                    }
                }
            }
        });
};
