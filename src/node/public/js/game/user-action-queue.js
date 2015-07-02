var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createUserActionQueue = function (actionQueue) {

    return {
        north: actionQueue.north,
        south: actionQueue.south,
        west: actionQueue.west,
        east: actionQueue.east,
        forward: actionQueue.forward,
        back: actionQueue.back,
        left: actionQueue.left,
        right: actionQueue.right,
        turn: actionQueue.turn,
        fire: actionQueue.fire,        
        clear: actionQueue.clear,
        isEmpty: actionQueue.isEmpty,
        length: actionQueue.length
    };
};
