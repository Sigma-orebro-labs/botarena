var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.classes = gosuArena.factories.classes || {};
gosuArena.factories.classes.default = gosuArena.factories.classes.default || {};

gosuArena.factories.classes.default.create = function () {
    return {
        initialHealthPointFactor: 1,
        damageReductionFactor: 1,
        weaponDamageFactor: 1,
        weaponCooldownTimeFactor: 1,
        bulletSpeedFactor: 1,
        actionsPerRoundFactor: 1,
        movementSpeedFactor: 1,
        sizeFactor: 1
    };
};
