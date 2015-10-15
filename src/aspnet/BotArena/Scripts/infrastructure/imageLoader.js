var gosuArena = gosuArena || {};
gosuArena.resources = gosuArena.resources || {};
gosuArena.resources.imageLoader = gosuArena.resources.imageLoader || {};

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

    function loadImage(name, url, allResourcesLoadedCallback) {

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
                allResourcesLoadedCallback();
            }
        };

        img.src = url;
    }

    gosuArena.resources.imageLoader.load = function(arenaState, allResourcesLoadedCallback) {
        loadImage('background', gosuArena.url.createAbsolute('/Content/images/sprites/map.jpg'), allResourcesLoadedCallback);
        loadImage('wallNorth', gosuArena.url.createAbsolute('/Content/images/sprites/wall_north.png'), allResourcesLoadedCallback);
        loadImage('wallSouth', gosuArena.url.createAbsolute('/Content/images/sprites/wall_south.png'), allResourcesLoadedCallback);
        loadImage('wallEast', gosuArena.url.createAbsolute('/Content/images/sprites/wall_east.png'), allResourcesLoadedCallback);
        loadImage('wallWest', gosuArena.url.createAbsolute('/Content/images/sprites/wall_west.png'), allResourcesLoadedCallback);
        loadImage('wallCornerLeft', gosuArena.url.createAbsolute('/Content/images/sprites/wall_corner_left.png'), allResourcesLoadedCallback);
        loadImage('wallCornerRight', gosuArena.url.createAbsolute('/Content/images/sprites/wall_corner_right.png'), allResourcesLoadedCallback);
        loadImage('bot', gosuArena.url.createAbsolute('/Content/images/sprites/mech2.png'), allResourcesLoadedCallback);

        for (var i = 0; i < arenaState.bots.length; i++) {
            var bot = arenaState.bots[i];
            var url = gosuArena.url.createAbsolute('/api/botnameimage?name=' + encodeURIComponent(bot.name) + '&colorHexCode=' + encodeURIComponent(bot.color));

            loadImage(bot.name + 'NameImage', url, allResourcesLoadedCallback);
        }
    };
})();