gosuArena.register({
    tick: function(actionQueue) {
        var random = Math.random();

        if (actionQueue.length() > 2) {
            return;
        }

        actionQueue.fire();

        if (random < 0.2) {
            actionQueue.north(100);
        } else if (random < 0.4) {
            actionQueue.south(100);
        } else if (random < 0.6) {
            actionQueue.west(100);
        } else if (random < 0.8) {
            actionQueue.east(100);
        } else {
            actionQueue.turn(Math.random() * 90);
        }
    },
    options: {
        botClass: "tank"
    }
});
