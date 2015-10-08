var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};

gosuArena.factories.modifiers.create = function (modifierName) {

    var safeModifierName = modifierName || "default";
    var lowercaseModifierName = safeModifierName.toLowerCase();
    
    var defaultModifier = gosuArena.factories.modifiers.default.create();

    switch (lowercaseModifierName) {
        case "tank":
            return gosuArena.factories.modifiers.classes.tank.create(defaultModifier);
        case "boosters":
            return gosuArena.factories.modifiers.equipment.boosters.create(defaultModifier);
        default:
            return defaultModifier;
    }
};