var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};
gosuArena.factories.modifiers.default = gosuArena.factories.modifiers.default || {};

gosuArena.factories.modifiers.default.create = function () {
    return {
        initialHealthPointFactor: 1,
        damageReductionFactor: 1,
        weaponDamageFactor: 1,
        weaponCooldownTimeFactor: 1,
        bulletSpeedFactor: 1,
        actionsPerRoundFactor: 1,
        movementSpeedFactor: 1,
        sizeFactor: 1,
        rotationSpeedFactor: 1
    };
};
