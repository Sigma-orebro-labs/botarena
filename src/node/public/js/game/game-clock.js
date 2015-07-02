gosuArena = gosuArena || {};
gosuArena.gameClock = gosuArena.gameClock || {};

gosuArena.gameClock.create = function () {
    var callbacks = [];
    var isRunning = false;
    var hasStarted = false;

    var tickCount = 0;
    var roundCountSinceIntervalStart = 0;
    var roundTimeSampleLength = 500;
    var intervalStartTimestamp = 0;
    var lastTimestamp = null;
    var targetRoundLength = 1000 / 60; // 60 FPS, ~16 ms

    function tick(callback) {
        callbacks.push(callback);
    }

    function callTickCallbacks(timestamp) {
        requestAnimationFrame(callTickCallbacks);

        if (isRunning) {

            // Try to keep game speed stable at 60 ticks/second
            // even if the FPS in the browser drops to 30 or below.
            var lastRoundLength = timestamp - lastTimestamp;
            var roundsToExecute = Math.round(lastRoundLength / targetRoundLength);

            callbacks.forEach(function (callback) {

                // Make sure there is nothing funky going on which 
                // makes the game execute loads of rounds all the time
                // if rendering should be very slow
                for (var i = 0; i < roundsToExecute && i < 4; i++)
                {
                    callback();
                    roundCountSinceIntervalStart++;
                }
            });

            if (tickCount > 0 && tickCount % roundTimeSampleLength == 0) {
                var intervalTimeInMilliseconds = timestamp - intervalStartTimestamp;
                var averageRoundTimeInMilliseconds =
                    intervalTimeInMilliseconds / roundTimeSampleLength;

                var averageFps = 1000 / averageRoundTimeInMilliseconds;
                var averageRoundsPerSecond = Math.round(
                    roundCountSinceIntervalStart / intervalTimeInMilliseconds * 1000);

                console.log(
                    averageRoundTimeInMilliseconds.toFixed(3) + " ms // " +
                        Math.round(averageFps) + " fps // " +
                        averageRoundsPerSecond + " rounds/second");

                intervalStartTimestamp = timestamp;
                roundCountSinceIntervalStart = 0;
            }

            tickCount++;
            lastTimestamp = timestamp;
        }
    }

    function start() {
        isRunning = true;

        if (!hasStarted) {
            hasStarted = true;
            requestAnimationFrame(callTickCallbacks);
        }
    }

    function stop() {
        isRunning = false;
    }

    return {
        start: start,
        stop: stop,
        tick: tick
    };
};
