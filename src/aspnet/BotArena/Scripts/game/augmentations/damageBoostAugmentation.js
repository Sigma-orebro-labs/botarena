var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.augmentations = gosuArena.factories.augmentations || {};

gosuArena.factories.augmentations.createDamageBoost = function(botProperties, exposedMethods) {

    var state = {};

    return gosuArena.factories.augmentations.createBaseAugmentation(
        botProperties,
        exposedMethods,
        {
            roundCount: 600,
            activated: function () {
                state.damageIncrease = botProperties.weapon.baseDamage;
                botProperties.weapon.baseDamage += state.damageIncrease;
            },
            deactivated: function() {
                botProperties.weapon.baseDamage -= state.damageIncrease;
            }
        });
};
