gosuArena.register({
    tick: function (actionQueue, status) {
        if (status.angle < 45) {
            actionQueue.turn(2);
        } else
        {
            actionQueue.south();
        }
    },
    options: {
        color: "navy",
        startPosition: {
            x: 305,
            y: 270
        }
    }
});
