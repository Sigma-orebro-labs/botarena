(function () {

    var gameClock = null;
    var isRunning = false;

    gosuArena.events.matchEnded(function (result) {
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

        var canvas3D = document.getElementById("3d-game-canvas");
        var gameVisualizer3D = gosuArena.factories.createGameVisualizer3D(canvas3D);

        gosuArena.engine.start(gameVisualizer, gameClock, {
            isTraining: gosuArena.settings.isTraining(),
            listeners: [gosuArena.matchViewModel, gameVisualizer3D]
        });

        gosuArena.events.raiseGameStarting();

        gameClock.start();
        isRunning = true;
    };

    function setRenderingMode(e) {
        var mode = e.target.id;
        if (mode === "2d-mode") {
            gosuArena.engine.setRenderingMode("2D");
            $("#gameCanvas").show();
            $("#3d-game-canvas").hide();
        }
        else {
            gosuArena.engine.setRenderingMode("3D");
            $("#gameCanvas").hide();
            $("#3d-game-canvas").show();
        }
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
