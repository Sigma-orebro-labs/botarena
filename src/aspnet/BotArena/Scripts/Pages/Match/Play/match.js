(function() {

    var gameClock = null;
    var isRunning = false;
    var canvasBabylon = document.getElementById("3d-game-canvas-babylon");

    gosuArena.visualizers = {
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
        var defaultCountDownsRemaining = gosuArena.settings.isTraining() ? 0 : 3;

        countDownsRemaining = countDownsRemaining === undefined ? defaultCountDownsRemaining : countDownsRemaining;
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

        var suddenDeathRule = 
            gosuArena.rules.createSuddenDeathRule(gameClock, {
                roundCount: 3000,
                healthReductionFactor: 0.5,
                // roundCountReductionFactor: 0.5 // not implemented yet
            });

        var validationRule =
            gosuArena.rules.createBotConfigValidationRule(gameClock, {
                maxAllowedAugmentationCount: 1,
                modifiers: {
                    "class": {
                        maxAllowedCount: 1
                    }, weapon: {
                        maxAllowedCount: 1
                    }, armor: {
                        maxAllowedCount: 1
                    }, bonusGear: {
                        maxAllowedCount: 1
                    }
                }
            });

        gosuArena.engine.start(gameClock, {
            isTraining: gosuArena.settings.isTraining(),
            rules: [suddenDeathRule, validationRule] 
        });

        gameClock.start();
        isRunning = true;
    };

    document.getElementById("restartMatch").onclick = function() {
        restartMatchWithCountDown();
    }
    document.getElementById("stopMatch").onclick = stopMatch;

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

    gosuArena.events.suddenDeath(function(number) {
        writeGameMessage("Sudden death #" + number + "!", 3000);
    });

    gosuArena.events.botValidationErrors(function (bots) {

        var botNames = bots.map(function(bot) {
            return bot.name;
        });

        sweetAlert({
            title: "Bot validation errors",
            text: "The match has been stopped since validation errors were found for the following bots: " + botNames.join(", "),
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            closeOnConfirm: true
        });
    });

    gosuArena.events.botScriptError(function (eventArgs) {

        gameClock.stop();

        sweetAlert({
            title: "Bot script error",
            text: "The match has been stopped since the bot '" + eventArgs.bot.name + "' has a script error :/ . The error was: " + eventArgs.exception.message,
            type: "error",
            showCancelButton: false,
            confirmButtonText: "OK",
            closeOnConfirm: true
        });
    });

    $(window).on("resize", adjustBabylonCanvasSize);

    $(function() {

        adjustBabylonCanvasSize();

        gosuArena.engine.initializeWorld({
            listeners: [
                gosuArena.matchViewModel,
                gosuArena.logging.createEventConsoleLogger(),
                gosuArena.visualizers.gameVisualizer3D,
                gosuArena.commander.createGameListener()
            ],
            resourceLoaders: [
                //gosuArena.resources.imageLoader, -- 2d mode is disabled
                gosuArena.resources.modifierConfigLoader
            ]
        });

        ko.applyBindings(gosuArena.matchViewModel);
    });
})();
