gosuArena = gosuArena || {};
gosuArena.gameClock = gosuArena.gameClock || {};

gosuArena.gameClock.createFake = function () {
    var callbacks = [];

    function tick(callback) {
        callbacks.push(callback);
    }

    function doTick(count) {
        count = count || 1;

        for(var i = 0; i < count; i++) {
            callbacks.forEach(function (callback) {
                callback();
            });            
        }
    }

    function start() { }
    function stop() { }

    return {
        start: start,
        stop: stop,
        tick: tick,
        doTick: doTick
    }
};
