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

    return {
        raiseMatchEnded: raiseMatchEnded,
        matchEnded: matchEnded,
        raiseResourcesLoaded: raiseResourcesLoaded,
        resourcesLoaded: resourcesLoaded,
        raiseGameStarting: raiseGameStarting,
        gameStarting: gameStarting
    };
})();

