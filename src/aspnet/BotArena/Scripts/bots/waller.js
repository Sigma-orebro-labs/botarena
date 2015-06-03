var wall = "north";

gosuArena.register({
    tick: function(actionQueue, status) {

        function tryFire() {
            if (status.canFire()) {
                actionQueue.fire();
            }
        }

        if (status.seenBots.length > 0) {
            actionQueue.clear();
            actionQueue.fire();
        }

        var tolerance = 20;

        if (wall == "north") {

            if (status.angle > 3) {
                actionQueue.clear();
                actionQueue.turn(2);
            } else if (status.arena.width - status.position.x - status.position.width < tolerance) {
                wall = "east";
                actionQueue.south(2);
            } else {
                actionQueue.east(2);
            }

        } else if (wall == "east") {

            if (status.angle > 93) {
                actionQueue.clear();
                actionQueue.turn(-2);
            } else if (status.angle < 87) {
                actionQueue.clear();
                actionQueue.turn(2);
            } else if (status.arena.height - status.position.y - status.position.height < tolerance) {
                wall = "south";
                actionQueue.west(2);
            } else {
                actionQueue.south(2);
            }

        } else if (wall == "south") {

            if (status.angle > 183) {
                actionQueue.clear();
                actionQueue.turn(-2);
            } else if (status.angle < 177) {
                actionQueue.clear();
                actionQueue.turn(2);
            } else if (status.position.x < tolerance) {
                wall = "west";
                actionQueue.north(2);
            } else {
                actionQueue.west(2);
            }

        } else if (wall == "west") {

            if (status.angle > 273) {
                actionQueue.clear();
                actionQueue.turn(-2);
            } else if (status.angle < 267) {
                actionQueue.clear();
                actionQueue.turn(2);
            } else if (status.position.y < tolerance) {
                wall = "north";
                actionQueue.east(2);
            } else {
                actionQueue.north(2);
            }
        }

        tryFire();
    },
    options: {
        color: "#f4f"
    }
});