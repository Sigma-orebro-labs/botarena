gosuArena = gosuArena || {};
gosuArena.arenaState = gosuArena.arenaState || {};

gosuArena.arenaState.create = function () {

    var botKilledCallbacks = [];
    var botAddedCallbacks = [];
    var botHitByBulletCallbacks = [];
    var bulletHitBotCallbacks = [];
    var bulletHitTerrainCallbacks = [];
    var shotFiredCallbacks = [];
    var tickCallbacks = [];
    var clearedCallbacks = [];
    var clearStartingCallbacks = [];

    var arenaState = {
        bots: [],
        terrain: [],
        bullets: []
    };

    arenaState.tick = function tick() {
        raiseOnTick();
    };

    function handleOnBotKilled(bot) {
        var livingBots = arenaState.livingBots();

        raiseOnBotKilled(bot);

        if (areAllLivingBotsOnTheSameTeam()) {
            gosuArena.events.raiseMatchEnded({
                winner: {
                    name: livingBots[0].teamId.toString(),
                    type: "team"
                }
            });
        } else if (livingBots.length == 1) {
            gosuArena.events.raiseMatchEnded({
                winner: {
                    name: livingBots[0].name,
                    type: "bot"
                }
            });
        }
    }

    function areAllLivingBotsOnTheSameTeam() {
        var livingBots = arenaState.livingBots();

        if (livingBots.length < 1 || !livingBots[0].teamId) {
            return false;
        }
        
        for (var i = 1; i < livingBots.length; i++) {
            if (livingBots[i].teamId != livingBots[0].teamId) {
                return false;
            }
        }

        return true;
    }
    
    arenaState.livingBots = function () {
        return arenaState.bots.filter(function (bot) {
            return bot.isAlive();
        });
    };

    arenaState.bulletHitBot = function(bullet) {
        removeBullet(bullet);
        raiseOnBulletHitBot(bullet);
    };

    arenaState.bulletHitTerrain = function (bullet) {
        removeBullet(bullet);
        raiseOnBulletHitTerrain(bullet);
    };

    function removeBullet(bullet) {
        var index = arenaState.bullets.indexOf(bullet);
        arenaState.bullets.splice(index, 1);
    };

    arenaState.clearGame = function () {

        raiseOnClearStarting();

        // We leave the terrain since it doesn't change between games
        arenaState.bots.length = 0;
        arenaState.bullets.length = 0;

        raiseOnCleared();
    };

    function removeCallbacks() {
        botKilledCallbacks = [];
        botAddedCallbacks = [];
        botHitByBulletCallbacks = [];
        bulletHitBotCallbacks = [];
        bulletHitTerrainCallbacks = [];
        shotFiredCallbacks = [];
        tickCallbacks = [];
    }

    arenaState.addBot = function (bot) {
        bot.onKilled(handleOnBotKilled);

        // Handle this inline so that we can pass the bot as the
        // parameter to the event handlers instead of the parameters
        // sent by the bot itself, since that passes arguments
        // suited for the bot developers, and hence cannot pass the
        // actual bot as an argument.
        bot.onHitByBullet(function () {
            raiseOnBotHitByBullet(bot);
        });

        bot.onShotFired(onShotFiredByBot);

        arenaState.bots.push(bot);

        raiseOnBotAdded(bot);
    };

    function onShotFiredByBot(bot) {
        var bullet = gosuArena.factories.createBullet(bot);
        arenaState.addBullet(bullet);

        raiseOnShotFired(bot, bullet);
    }

    arenaState.addTerrain = function (terrain) {
        arenaState.terrain.push(terrain);
    };

    arenaState.addBullet = function (bullet) {
        arenaState.bullets.push(bullet);
    };

    arenaState.onBotAdded = function (callback) {
        botAddedCallbacks.push(callback);
    };

    arenaState.onBotKilled = function (callback) {
        botKilledCallbacks.push(callback);
    };

    arenaState.onBotHitByBullet = function (callback) {
        botHitByBulletCallbacks.push(callback);
    };

    arenaState.onShotFired = function (callback) {
        shotFiredCallbacks.push(callback);
    };

    arenaState.onBulletHitBot = function (callback) {
        bulletHitBotCallbacks.push(callback);
    };

    arenaState.onBulletHitTerrain = function (callback) {
        bulletHitTerrainCallbacks.push(callback);
    };

    arenaState.onTick = function (callback) {
        tickCallbacks.push(callback);
    };

    arenaState.onClearStarting = function (callback) {
        clearStartingCallbacks.push(callback);
    };

    arenaState.onCleared = function (callback) {
        clearedCallbacks.push(callback);
    };

    function raiseOnBotKilled(bot) {
        botKilledCallbacks.forEach(function (callback) {
            callback(bot);
        });
    }

    function raiseOnBotHitByBullet(bot) {
        botHitByBulletCallbacks.forEach(function (callback) {
            callback(bot);
        });
    }

    function raiseOnBotAdded(bot) {
        botAddedCallbacks.forEach(function (callback) {
            callback(bot);
        });
    }

    function raiseOnShotFired(bullet) {
        shotFiredCallbacks.forEach(function (callback) {
            callback(bullet);
        });
    }

    function raiseOnBulletHitBot(bullet) {
        bulletHitBotCallbacks.forEach(function (callback) {
            callback(bullet);
        });
    }

    function raiseOnBulletHitTerrain(bullet) {
        bulletHitTerrainCallbacks.forEach(function (callback) {
            callback(bullet);
        });
    }

    function raiseOnTick() {
        tickCallbacks.forEach(function (callback) {
            callback();
        });
    }

    function raiseOnCleared() {
        clearedCallbacks.forEach(function (callback) {
            callback();
        });
    }

    function raiseOnClearStarting() {
        clearStartingCallbacks.forEach(function (callback) {
            callback();
        });
    }

    return arenaState;
}
