(function() {

    var gameClock = null;
    var isRunning = false;

    gosuArena.events.matchEnded(function(result) {
        stopMatch();
    });

    gosuArena.matchViewModel = gosuArena.factories.createMatchViewModel();

    function restartMatch() {
        if (gameClock) {
            gameClock.stop();
        }

        gameClock = gosuArena.gameClock.create();

        var canvas = document.getElementById("gameCanvas");
        var gameVisualizer = gosuArena.factories.createGameVisualizer(canvas);

        /*var canvas3D = document.getElementById("3d-game-canvas");
        var gameVisualizer3D = gosuArena.factories.createGameVisualizer3D(canvas3D);*/

        var canvasBabylon = document.getElementById("3d-game-canvas-babylon");
        var gameVisualizerBabylon = gosuArena.factories.createGameVisualizerBabylon(canvasBabylon);

        gosuArena.engine.start(gameClock, {
            isTraining: gosuArena.settings.isTraining(),
            listeners: [gosuArena.matchViewModel, gameVisualizer, gameVisualizerBabylon]
        });

        gosuArena.events.raiseGameStarting();

        gameClock.start();
        isRunning = true;
    };


    function setRenderingMode(e) {
        $("#3d-game-canvas-babylon").show();
        $("#gameCanvas").show();
        var mode = e.target.id;
        /*if (mode === "2d-mode") {
            $("#gameCanvas").show();
            $("#3d-game-canvas").hide();
            $("#3d-game-canvas-babylon").hide();
        }
        else {
            $("#gameCanvas").hide();
            $("#3d-game-canvas").show();
            $("#3d-game-canvas-babylon").show();
    }*/
    };

    function stopMatch() {
        if (gameClock) {
            gameClock.stop();
        }

        isRunning = false;
    }

    document.getElementById("restartMatch").onclick = restartMatch;
    document.getElementById("stopMatch").onclick = stopMatch;

    document.getElementById("2d-mode").onclick = setRenderingMode;
    document.getElementById("3d-mode").onclick = setRenderingMode;

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
