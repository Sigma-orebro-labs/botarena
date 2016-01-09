var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

// An augmentation that does nothing. Used when an invalid augmentation name is specified to the factory.
gosuArena.factories.augmentations.createNoopAugmentation = function(botProperties, exposedMethods) {


    return gosuArena.factories.augmentations.createBaseAugmentation(
        botProperties,
        exposedMethods,
        {
            roundCount: 0
        });
};
