var gosuArena = gosuArena || {};
gosuArena.resources = gosuArena.resources || {};
gosuArena.resources.modifierConfigLoader = gosuArena.resources.modifierConfigLoader || {};

gosuArena.sprites = gosuArena.sprites || {};

(function() {

    gosuArena.resources.modifierConfigLoader.load = function (arenaState, allResourcesLoadedCallback) {
        $.getJSON(gosuArena.url.createAbsolute("/api/modifiers"), function (data) {
            gosuArena.factories.modifiers.initialize(data);
            allResourcesLoadedCallback();
        });
    };
})();