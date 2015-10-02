var gosuArena = gosuArena || {};

gosuArena.extend = function (target, source) {
    for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
            target[prop] = source[prop];
        }
    }
};
