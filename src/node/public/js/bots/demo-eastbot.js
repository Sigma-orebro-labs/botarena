gosuArena.register({
    tick: function (actionQueue, status) {
        actionQueue.east(20);
    },
    options: {
        color: "#a0a",
        startPosition: {
            x: gosuArena.arenaWidth - 100,
            y: gosuArena.arenaHeight / 5
        }
    }
});
