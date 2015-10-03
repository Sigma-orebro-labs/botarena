var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.classes = gosuArena.factories.classes || {};

gosuArena.factories.classes.createFromOptions = function (options) {

    // to lower
    
    var defaultClass = gosuArena.factories.classes.default.create();

    switch (options.botClass) {
        case "tank":
            return gosuArena.factories.classes.tank.create(defaultClass);
        default:
            return defaultClass;
    }
};