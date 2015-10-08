var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};

gosuArena.factories.modifiers.createClassFromOptions = function (botClassName) {

    // to lower
    
    var defaultClass = gosuArena.factories.modifiers.classes.default.create();

    switch (botClassName) {
        case "tank":
            return gosuArena.factories.modifiers.classes.tank.create(defaultClass);
        default:
            return defaultClass;
    }
};