var gosuArena = gosuArena || {};
gosuArena.fakeTicker = gosuArena.fakeTicker || {};

gosuArena.fakeTicker.create = function () {

    var nextAction = null;
    var wasTickCalled = false;
    
    function tick(actionQueue, status) {
        if (nextAction) {
            nextAction(actionQueue, status);
            nextAction = null;
        }
    }

    function setNextAction(action) {
        nextAction = action;
    }
    
    return {
        tick: tick,
        setNextAction: setNextAction,
        wasTickCalled: wasTickCalled
    }
};
