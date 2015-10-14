var gosuArena = gosuArena || {};
gosuArena.resourceLoader = gosuArena.resourceLoader || {};

gosuArena.sprites = gosuArena.sprites || {};

(function() {
    var requestedResources = [];

    function areAllSpritesLoaded() {
        for (var i = 0; i < requestedResources.length; i++) {
            var resourceName = requestedResources[i];

            // Make sure that all requested resources have been initialized
            if (!gosuArena.sprites[resourceName]) {
                return false;
            }
        }

        return true;
    }

    gosuArena.resourceLoader.loadImage = function (name, url) {

        // Check if the resource has already been loaded
        if (gosuArena.sprites[name]) {
            return;
        }

        // Mark the resource as requested, to keep track of all resources are loaded
        requestedResources.push(name);

        var img = new Image();

        img.onload = function() {
            gosuArena.sprites[name] = img;

            if (areAllSpritesLoaded()) {
                gosuArena.events.raiseResourcesLoaded();
                gosuArena.sprites.isLoaded = true;
            }
        };

        img.src = url;
    }
})();