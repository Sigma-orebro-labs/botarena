var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.classes = gosuArena.factories.classes || {};

gosuArena.factories.classes.createFromOptions = function (options) {

    // to lower
    
    switch (options.botClass) {
        case "tank":
            return gosuArena.factories.classes.tank.create();
        default:
            return gosuArena.factories.classes.default.create();
    }
};