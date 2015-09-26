var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

gosuArena.factories.augmentations.createCloak = function(botProperties) {

    var augmentationProperties = {
        roundsRemaining: 500,
        isActive: false
    };

    function getRoundsRemaining() {
        return augmentationProperties.roundsRemaining;
    }

    function getIsActive() {
        return augmentationProperties.isActive;
    }

    function tick() {
        if (getRoundsRemaining() <= 0) {
            botProperties.isVisible = true;
        } else if (augmentationProperties.isActive) {
            augmentationProperties.roundsRemaining -= 1;
        }
    }

    function activate() {
        if (getRoundsRemaining() > 0) {
            augmentationProperties.isActive = true;
            botProperties.isVisible = false;
        }
    }

    return {
        tick: tick,
        activate: activate,
        isActive: getIsActive,
        roundsRemaining: getRoundsRemaining
    };
};
