gosuArena.register({
    tick: function (actionQueue, status) {

        if (status.position.isAtSouthWall) {
            actionQueue.clear();
            actionQueue.north(50);
        } else {
            actionQueue.south();
        }

        if (status.position.isAtEastWall) {
            actionQueue.clear();
            actionQueue.west(30);
        } else {
            actionQueue.east();
        }
    },
    options: {
        color: "#0a0",
        startPosition: {
            x: gosuArena.arenaWidth / 3,
            y: gosuArena.arenaHeight / 4
        }
    }
});
