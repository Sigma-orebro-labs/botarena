gosuArena.register({
    tick: function (actionQueue, status) {

        if (status.angle < 15) {
            actionQueue.turn(2);
        }

        actionQueue.north(20);
    },
    options: {
        color: "#70f",
        startPosition: {
            x: 100,
            y: 100
        }
    }
});
