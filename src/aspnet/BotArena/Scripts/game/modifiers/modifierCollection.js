var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};

gosuArena.factories.modifiers.createModifierCollection = function (modifiers) {
    return {
        calculateHealthPointFactor: function() { return modifiers[0].initialHealthPointFactor; },
        calculateMovementSpeedFactor: function() { return modifiers[0].movementSpeedFactor; },
        calculateDamageReductionFactor: function() { return modifiers[0].damageReductionFactor; },
    };
};