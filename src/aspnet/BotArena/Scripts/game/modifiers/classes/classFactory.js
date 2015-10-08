var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};

gosuArena.factories.modifiers.createClassFromOptions = function (botClassName) {

    var safeClassName = botClassName || "default";
    var lowercaseClassName = safeClassName.toLowerCase();
    
    var defaultClass = gosuArena.factories.modifiers.classes.default.create();

    switch (lowercaseClassName) {
        case "tank":
            return gosuArena.factories.modifiers.classes.tank.create(defaultClass);
        default:
            return defaultClass;
    }
};