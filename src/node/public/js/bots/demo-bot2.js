var xDirection = 1;

gosuArena.register({
    tick: function (actionQueue, status) {
        if (status.position.x > gosuArena.arenaWidth / 2.0) {
            xDirection = -1;
        } else if (status.position.x < gosuArena.arenaWidth / 4.0) {
            xDirection = 1;
        }

        if (status.position.isAtWestWall || status.position.isAtEastWall) {
            actionQueue.clear();
        }

        if (xDirection == 1) {
            actionQueue.east(10);
            actionQueue.north(1);
        } else {
            actionQueue.west(10);
            actionQueue.south(1);
        }
    },
    options: {
        color: "#aa0",
        startPosition: {
            x: gosuArena.arenaWidth / 3,
            y: gosuArena.arenaHeight / 3
        }
    }
});
