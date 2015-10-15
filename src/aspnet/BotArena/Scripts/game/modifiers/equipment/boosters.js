var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};
gosuArena.factories.modifiers.equipment = gosuArena.factories.modifiers.equipment || {};
gosuArena.factories.modifiers.equipment.boosters = gosuArena.factories.modifiers.equipment.boosters || {};

gosuArena.factories.modifiers.equipment.boosters.create = function (baseClass) {

    baseClass.movementSpeedFactor = 2;

    return baseClass;
};
