var gosuArena = gosuArena || {};
gosuArena.util = gosuArena.util || {};

gosuArena.util.deepCopy = function (original) {

    if ($.isArray(original)) {
        return original.map(function(x) {
            return gosuArena.util.deepCopy(x);
        });
    }

    return jQuery.extend(true, {}, original);
};