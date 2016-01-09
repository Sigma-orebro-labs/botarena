var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

// An augmentation that does nothing. Used when an invalid augmentation name is specified to the factory.
gosuArena.factories.augmentations.createNoopAugmentation = function(botProperties) {

    function getRoundsRemaining() {
        return 0;
    }

    function getIsActive() {
        return false;
    }

    function tick() {
    }

    function activate() {
    }

    return {
        tick: tick,
        activate: activate,
        isActive: getIsActive,
        roundsRemaining: getRoundsRemaining
    };
};
