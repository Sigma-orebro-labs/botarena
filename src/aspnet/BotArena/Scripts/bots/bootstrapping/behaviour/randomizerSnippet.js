        var random = Math.random();

        actionQueue.fire();

        if (random < 0.2) {
            actionQueue.north(2);
        } else if (random < 0.4) {
            actionQueue.south(2);
        } else if (random < 0.6) {
            actionQueue.west(2);
        } else if (random < 0.8) {
            actionQueue.east(2);
        } else {
            actionQueue.turn(2);
        }
