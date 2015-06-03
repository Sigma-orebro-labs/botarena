var xDirection = 1;

gosuArena.register({
    tick: function (actionQueue, status) {
        if (xDirection == 1) {
            actionQueue.east(2);
        } else {
            actionQueue.west(2);
        }
    },
    onCollision: function (actionQueue, status) {
        actionQueue.clear();
        xDirection *= -1;
    },
    options: {
        color: "#a00",
        startPosition: {
            x: gosuArena.arenaWidth / 2,
            y: gosuArena.arenaHeight / 3
        }
    }
});
