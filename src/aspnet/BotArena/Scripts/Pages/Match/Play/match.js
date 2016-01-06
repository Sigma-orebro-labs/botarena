(function() {

    var gameClock = null;
    var isRunning = false;
    var canvas = document.getElementById("gameCanvas");
    var canvasBabylon = document.getElementById("3d-game-canvas-babylon");

    gosuArena.visualizers = {
        gameVisualizer2D: gosuArena.factories.createGameVisualizer(canvas),
        gameVisualizer3D: gosuArena.factories.createGameVisualizerBabylon(canvasBabylon)
    };

    function stopMatch() {
        if (gameClock) {
            gameClock.stop();
        }

        isRunning = false;
    }

    gosuArena.events.matchEnded(function(result) {
        stopMatch();
    });

    gosuArena.matchViewModel = gosuArena.factories.createMatchViewModel();

    function writeGameMessage(message, autoHideDelay) {
        console.log(message);
        var $messageElement = $(".game-message");
        $messageElement.show();
        $messageElement.text(message);

        if (autoHideDelay) {
            setTimeout(function() {
                $messageElement.hide();
            }, autoHideDelay);
        }
    }

    function restartMatchWithCountDown(countDownsRemaining, delay, hasShownInitialMessage) {
        countDownsRemaining = countDownsRemaining === undefined ? 3 : countDownsRemaining;
        delay = delay || 1000;

        if (!countDownsRemaining || countDownsRemaining <= 0) {

            writeGameMessage("Fight!", 1000);

            restartMatch();
            return;
        }

        var newCountDownsRemaining = countDownsRemaining;

        if (!hasShownInitialMessage) {
            writeGameMessage("Game starting in...");
        } else {
            writeGameMessage(countDownsRemaining);
            newCountDownsRemaining--;
        }

        setTimeout(function() {
            restartMatchWithCountDown(newCountDownsRemaining, delay, true);
        }, delay);
    }

    function restartMatch() {
        if (gameClock) {
            gameClock.stop();
        }

        gameClock = gosuArena.gameClock.create();

        gosuArena.engine.start(gameClock, {
            isTraining: gosuArena.settings.isTraining()
        });

        gameClock.start();
        isRunning = true;
    };


    function setRenderingMode(e) {
        $("#3d-game-canvas-babylon").show();
        $("#gameCanvas").show();
        var mode = e.target.id;
        if (mode === "2d-mode") {
            //$("#3d-game-canvas").hide();
            $("#3d-game-canvas-babylon").hide();
            $("#gameCanvas").show();
        }
        else if (mode === "both-mode") {
            $("#gameCanvas").show();
            $("#3d-game-canvas-babylon").show();
        }
        else {
            $("#gameCanvas").hide();
            //$("#3d-game-canvas").show();
            $("#3d-game-canvas-babylon").show();
        }
    };

    document.getElementById("restartMatch").onclick = function() {
        restartMatchWithCountDown();
    }
    document.getElementById("stopMatch").onclick = stopMatch;

    document.getElementById("2d-mode").onclick = setRenderingMode;
    document.getElementById("3d-mode").onclick = setRenderingMode;
    document.getElementById("both-mode").onclick = setRenderingMode;

    function adjustBabylonCanvasSize() {
        var canvas = document.getElementById("3d-game-canvas-babylon");

        var width = window.devicePixelRatio * window.innerWidth;
        var height = window.devicePixelRatio * window.innerHeight;

        if (gosuArena.visualizers.babylonEngine) {
            gosuArena.visualizers.babylonEngine.setSize(width, height);
            gosuArena.visualizers.babylonEngine.resize();
        }

        canvas.width = width;
        canvas.height = height;
    }

    gosuArena.events.worldInitialized(function () {

        setTimeout(function() {
            gosuArena.visualizers.gameVisualizer3D.moveCameraToDefaultGamePosition();
            restartMatchWithCountDown();
        }, 1000);
    });

    gosuArena.events.matchEnded(function(matchResult) {
        var message = "The winner is " + matchResult.winner.name + "!";

        writeGameMessage(message);
    });

    $(window).on("resize", adjustBabylonCanvasSize);

    $(function() {

        gosuArena.realtime.connect(function() {
            var gameHub = $.connection.gameHub;
            gameHub.server.createGameRoom().done(function(roomName) {
                console.log("Started game room: " + roomName + "...");
            });
        });

        adjustBabylonCanvasSize();

        gosuArena.engine.initializeWorld({
            listeners: [gosuArena.matchViewModel, gosuArena.visualizers.gameVisualizer2D, gosuArena.visualizers.gameVisualizer3D],
            resourceLoaders: [gosuArena.resources.imageLoader, gosuArena.resources.modifierConfigLoader]
        });

        ko.applyBindings(gosuArena.matchViewModel);
    });
})();
