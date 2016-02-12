var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createActionQueue = function (collisionDetector, bot) {

    var actions = [];

    function dequeueAction() {
        return actions.shift();
    }

    function enqueueAction(action, count) {
        count = count || 1;

        for (var i = 0; i < count; i++) {
            actions.push(action);
        }
    }

    function changePosition(modifierFunction) {

        bot.snapshotPosition();

        modifierFunction(bot);

        var collidingBots = collisionDetector.collidingBots(bot);
        var collidingWalls = collisionDetector.collidingWalls(bot);

        if (collidingBots.length > 0 || collidingWalls.length > 0) {
            bot.restoreSnapshot();

            bot.collided();

            if (collidingBots.length > 0) {
                for (var i = 0; i < collidingBots.length; i++) {
                    collidingBots[i].collided();
                }
            }
        }
    }

    function north(count) {
        enqueueAction(function () {
            changePosition(function (b) {
                b.moveNorth();
            });
        }, count);
    }

    function south(count) {
        enqueueAction(function () {
            changePosition(function (b) {
                b.moveSouth();
            });
        }, count);
    }

    function west(count) {
        enqueueAction(function () {
            changePosition(function (b) {
                b.moveWest();
            });
        }, count);
    }

    function east(count) {
        enqueueAction(function() {
            changePosition(function (b) {
                b.moveEast();
            });
        }, count);
    }

    function turn(degrees) {
        var increment = degrees >= 0 ? bot.rotationSpeedInDegrees : -bot.rotationSpeedInDegrees;
        var iterationCount = Math.abs(degrees);

        enqueueAction(function () {
            changePosition(function(b) {
                b.turn(increment);
            });
        }, iterationCount);
    }

    function forward(count) {
        enqueueAction(function () {
            changePosition(function(b) {
                b.moveForward();
            });
        }, count);
    }

    function back(count) {
        enqueueAction(function () {
            changePosition(function(b) {
                b.moveBack();
            });
        }, count);
    }

    function left(count) {
        enqueueAction(function () {
            changePosition(function(b) {
                b.moveLeft();
            });
        }, count);
    }

    function right(count) {
        enqueueAction(function () {
            changePosition(function(b) {
                b.moveRight();
            });
        }, count);
    }

    function isEmpty() {
        return actions.length <= 0;
    }

    function length() {
        return actions.length;
    }

    function clear() {
        actions.length = 0;
    }

    function performNext() {
        if (isEmpty()) {
            return;
        }

        var nextAction = dequeueAction();
        nextAction(bot);
    }

    function fire(angle) {
        enqueueAction(function (b) {
            b.fire(angle);
        });
    }

    return {
        north: north,
        south: south,
        west: west,
        east: east,
        forward: forward,
        back: back,
        left: left,
        right: right,
        performNext: performNext,
        clear: clear,
        isEmpty: isEmpty,
        length: length,
        turn: turn,
        fire: fire
    };
}
