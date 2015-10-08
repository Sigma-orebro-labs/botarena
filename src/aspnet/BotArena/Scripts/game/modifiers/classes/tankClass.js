var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};
gosuArena.factories.modifiers.classes = gosuArena.factories.modifiers.classes || {};
gosuArena.factories.modifiers.classes.tank = gosuArena.factories.modifiers.classes.tank || {};

gosuArena.factories.modifiers.classes.tank.create = function (baseClass) {

    baseClass.initialHealthPointFactor = 1.5;
    baseClass.damageReductionFactor = 1.5;
    baseClass.weaponDamageFactor = 2;
    baseClass.weaponCooldownTimeFactor = 2;
    baseClass.bulletSpeedFactor = 1;
    baseClass.movementSpeedFactor = 0.5;
    baseClass.actionsPerRoundFactor = 0.5;

    return baseClass;
};
