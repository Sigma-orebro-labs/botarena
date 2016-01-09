var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

gosuArena.factories.augmentations.createRepair = function(botProperties, methods) {

    var augmentationProperties = {
        roundsRemaining: 300,
        isActive: false
    };

    function getRoundsRemaining() {
        return augmentationProperties.roundsRemaining;
    }

    function getIsActive() {
        return augmentationProperties.isActive;
    }

    function tick() {
        var roundsRemaining = getRoundsRemaining();

        if (augmentationProperties.isActive) {

            if (roundsRemaining >= 0 && (roundsRemaining % 10) === 0) {
                methods.setHealth(botProperties.health + 1);
            }

            augmentationProperties.roundsRemaining -= 1;
        }
    }

    function activate() {
        if (getRoundsRemaining() > 0) {
            augmentationProperties.isActive = true;
        }
    }

    return {
        tick: tick,
        activate: activate,
        isActive: getIsActive,
        roundsRemaining: getRoundsRemaining
    };
};
