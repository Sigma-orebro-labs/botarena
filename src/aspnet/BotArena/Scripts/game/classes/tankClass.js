var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.classes = gosuArena.factories.classes || {};
gosuArena.factories.classes.tank = gosuArena.factories.classes.tank || {};

gosuArena.factories.classes.tank.create = function () {
    return {
        hpFactor: 1.5,
        damageReductionFactor: 1,
        weaponDamageFactor: 1,
        actionsPerRoundFactor: 1,
        movementSpeedFactor: 1,
        sizeFactor: 1
    };
};
