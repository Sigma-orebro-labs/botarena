var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

gosuArena.factories.augmentations.createBaseAugmentation = function(botProperties, exposedMethods, options) {

    options.activated = options.activated || function() {};
    options.deactivated = options.deactivated || function() {};
    options.tick = options.tick || function() {};

    var augmentation = {};

    // Private state that should not be exposed to the devs coding their AI:s
    var state = {
        roundsRemaining: options.roundCount,
        isActive: false
    };

    augmentation.roundsRemaining = function () {    
        return state.roundsRemaining;
    }

    augmentation.isActive = function () {
        return state.isActive;
    }

    augmentation.tick = function () {
        if (state.isActive) {

            if (state.roundsRemaining > 0) {

                options.tick(augmentation, botProperties, exposedMethods);

                state.roundsRemaining -= 1;
            } else {
                state.isActive = false;

                options.deactivated(augmentation, botProperties, exposedMethods);

                exposedMethods.raiseAugmentationDeactivated(augmentation); // raise event only when roundsRemaining "runs out"
            }
        }
    }

    augmentation.activate = function () {
        if (!state.isActive && augmentation.roundsRemaining() > 0) {
            state.isActive = true;

            options.activated(augmentation, botProperties, exposedMethods);

            exposedMethods.raiseAugmentationActivated(augmentation);
        }
    }

    return augmentation;
};
