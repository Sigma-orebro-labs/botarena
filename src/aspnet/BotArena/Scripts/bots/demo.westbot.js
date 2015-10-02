gosuArena.register({
    tick: function (actionQueue, status) {

        if (Math.abs(status.angle - 270) >= 1.5) {
            actionQueue.turn(-2);
        } else {
            actionQueue.west(20);
        }
    },
    options: {
        color: "#a0a",
        startPosition: {
            x: 90,
            y: 110
        }
    }
});
