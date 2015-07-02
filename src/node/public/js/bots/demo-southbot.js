gosuArena.register({
    tick: function (actionQueue, status) {
        actionQueue.south(20);
    },
    options: {
        color: "#a0a",
        startPosition: {
            x: gosuArena.arenaWidth / 5,
            y: gosuArena.arenaHeight - 100
        }
    }
});
