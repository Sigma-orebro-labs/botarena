var gosuArena = gosuArena || {};

gosuArena.events = (function () {

    function raiseMatchEnded(eventArgs) {
        gosu.eventAggregator.publish("matchEnded", eventArgs);
    }

    function matchEnded(callback) {
        gosu.eventAggregator.subscribe("matchEnded", callback);
    }

    function raiseResourcesLoaded() {
        gosu.eventAggregator.publish("resourcesLoaded");
    }
    
    function resourcesLoaded(callback) {
        gosu.eventAggregator.subscribe("resourcesLoaded", callback);
    }

    function raiseGameStarting() {
        gosu.eventAggregator.publish("gameStarting");
    }

    function gameStarting(callback) {
        gosu.eventAggregator.subscribe("gameStarting", callback);
    }

    function raiseWorldInitialized() {
        gosu.eventAggregator.publish("worldInitialized");
    }

    function worldInitialized(callback) {
        gosu.eventAggregator.subscribe("worldInitialized", callback);
    }

    function raiseBotRegistrationStarting() {
        gosu.eventAggregator.publish("botRegistrationStarting");
    }

    function botRegistrationStarting(callback) {
        gosu.eventAggregator.subscribe("botRegistrationStarting", callback);
    }

    function raiseTargetCameraOnBot(bot) {
        gosu.eventAggregator.publish("targetCameraOnBot", bot);
    }

    function targetCameraOnBot(callback) {
        gosu.eventAggregator.subscribe("targetCameraOnBot", callback);
    }

    function raiseBotScriptError(bot) {
        gosu.eventAggregator.publish("botScriptError", bot);
    }

    function botScriptError(callback) {
        gosu.eventAggregator.subscribe("botScriptError", callback);
    }

    return {
        raiseMatchEnded: raiseMatchEnded,
        matchEnded: matchEnded,
        raiseResourcesLoaded: raiseResourcesLoaded,
        resourcesLoaded: resourcesLoaded,
        raiseGameStarting: raiseGameStarting,
        gameStarting: gameStarting,
        raiseWorldInitialized: raiseWorldInitialized,
        worldInitialized: worldInitialized,
        botRegistrationStarting: botRegistrationStarting,
        raiseBotRegistrationStarting: raiseBotRegistrationStarting,
        raiseTargetCameraOnBot: raiseTargetCameraOnBot,
        targetCameraOnBot: targetCameraOnBot,
        raiseBotScriptError: raiseBotScriptError,
        botScriptError: botScriptError
    };
})();

