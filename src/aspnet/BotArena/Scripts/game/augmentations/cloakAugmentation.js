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

            if (augmentationProperties.roundsRemaining <= 0) {
                gosuArena.events.raiseTurnBotSolid(botProperties.id); // raise event only when roundsRemaining "runs out"
            }
        }
    }

    function activate() {
        if (getRoundsRemaining() > 0) {
            augmentationProperties.isActive = true;
            botProperties.isVisible = false;
            gosuArena.events.raiseTurnBotTransparent(botProperties.id);
        }
    }

    return {
        tick: tick,
        activate: activate,
        isActive: getIsActive,
        roundsRemaining: getRoundsRemaining
    };
};
