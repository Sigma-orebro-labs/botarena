var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};

(function() {

    var sharedState = {
        config: []
    };

    gosuArena.factories.modifiers.initialize = function(config) {
        sharedState.config = config;
    }

    gosuArena.factories.modifiers.create = function(modifierId) {
        var modifiers = sharedState.config;

        for (var i = 0; i < modifiers.length; i++) {
            if (modifiers[i].id === modifierId) {
                return modifiers[i];
            }
        }

        // If an invalid modifier id has been specified, create a default modifier
        // which just has the default values for everything (will cause no stats changes).
        return {
            id: "default",
            name: "default",
            modifiers: gosuArena.factories.modifiers.default.create()
        };
    }
})();