var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

(function () {
    var state = {};

    function initialize() {

        // Initialize lazily to avoid dependency on that all augmentation scripts must be loaded
        // before this scipt file (otherwise the createXYZ function for a given augmentation might be undefined
        // when this script is loaded).
        state.augmentations = [
            {
                id: "cloak",
                name: "Mirage",
                description: "Using the optical illusions of the sea, the crew can temporarily make the ship undetectable to others.",
                create: gosuArena.factories.augmentations.createCloak
            }, {
                id: "repair",
                name: "Repair",
                description: "With a crew trained to do mid-fight ship repairs, the ship can be partially restored when damaged.",
                create: gosuArena.factories.augmentations.createRepair
            }
        ];
    }

    function ensureInitialized() {
        if (!state.augmentations) {
            initialize();
        }
    }

    gosuArena.factories.augmentations.getAugmentations = function () {
        ensureInitialized();
        return gosuArena.util.deepCopy(state.augmentations);
    };

    gosuArena.factories.augmentations.createDescriptor = function (augmentationId) {

        ensureInitialized();

        for (var i = 0; i < state.augmentations.length; i++) {
            if (state.augmentations[i].id === augmentationId) {
                return state.augmentations[i];
            }
        }

        // If an invalid augmentation id has been specified, create a default modifier
        // which does nothing.
        return {
            id: "default",
            name: "default",
            create: gosuArena.factories.augmentations.createNoopAugmentation
        };
    };
})();