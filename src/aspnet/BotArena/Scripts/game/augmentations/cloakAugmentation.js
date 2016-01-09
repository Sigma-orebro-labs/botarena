var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

gosuArena.factories.augmentations.createCloak = function(botProperties, exposedMethods) {

    return gosuArena.factories.augmentations.createBaseAugmentation(
        botProperties,
        exposedMethods,
        {
            roundCount: 500,
            activated: function() {
                botProperties.isVisible = false;
            },
            deactivated: function() {
                botProperties.isVisible = true;
            }
        });
};
