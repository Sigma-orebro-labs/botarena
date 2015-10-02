var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createTerrain = function (options) {
    var options = options || {};
    
    var properties = {
        x: options.x || 0,
        y: options.y || 0,
        width: options.width,
        height: options.height,
        color: options.color || "#000",
        angle: options.angle || 0
    };

    return gosuArena.worldObject.create(properties);
};
