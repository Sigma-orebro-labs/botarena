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

    function restartMatch() {
        if (gameClock) {
            gameClock.stop();
        }

        gameClock = gosuArena.gameClock.create();

        gosuArena.engine.start(gameClock, {
            isTraining: gosuArena.settings.isTraining(),
            listeners: [gosuArena.matchViewModel, gosuArena.visualizers.gameVisualizer2D, gosuArena.visualizers.gameVisualizer3D]
        });

        gosuArena.events.raiseGameStarting();

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

    document.getElementById("restartMatch").onclick = restartMatch;
    document.getElementById("stopMatch").onclick = stopMatch;

    document.getElementById("2d-mode").onclick = setRenderingMode;
    document.getElementById("3d-mode").onclick = setRenderingMode;
    document.getElementById("both-mode").onclick = setRenderingMode;

    // Make sure the match is not started until all resources have been loaded
    // that are needed for the game (e.g. sprites)
    gosuArena.events.resourcesLoaded(function() {
        restartMatch();
    });

    $(function () {
        
        if (gosuArena.sprites.isLoaded && !isRunning) {
            restartMatch();
        }

        ko.applyBindings(gosuArena.matchViewModel); 
    });
})();
