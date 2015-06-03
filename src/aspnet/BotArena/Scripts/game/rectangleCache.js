var gosuArena = gosuArena || {};
gosuArena.rectangleCache = gosuArena.rectangleCache || {};

gosuArena.rectangleCache.create = function (obj) {

    var entries = [];
    var cacheSize = 15;
    
    function createCacheEntry(obj, rectangle) {
        var height = obj.height;
        var width = obj.width;
        var x = obj.x;
        var y = obj.y;
        var angle = obj.angle;

        function isValidFor(o) {
            return o.x == x &&
                o.y == y &&
                o.width == width &&
                o.height == height &&
                o.angle == angle;
        }

        return {
            rectangle: rectangle,
            x: x,
            y: y,
            width: width,
            height:height,
            angle: angle,
            isValidFor: isValidFor
        };
    }

    function firstValidEntryFor(obj) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isValidFor(obj)) {
                return entries[i].rectangle;
            }
        }

        return null;
    }
    
    function isValidFor(obj) {
        return firstValidEntryFor(obj) != null;
    }

    function addEntry(obj, rectangle) {
        if (entries.length > cacheSize) {
            entries.shift();
        }

        entries.splice(0, 0, createCacheEntry(obj, rectangle));
    }

    return {
        isValidFor: isValidFor,
        getEntry: firstValidEntryFor,
        addEntry: addEntry
    }
};
