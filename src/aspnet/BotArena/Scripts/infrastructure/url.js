var gosuArena = gosuArena || {};
gosuArena.url = gosuArena.url || {};

gosuArena.url.createAbsolute = function(relativeUrl) {

    function hasLeadingSlash(s) {
        return /^\//.test(s);
    }

    if (hasLeadingSlash(relativeUrl)) {
        relativeUrl = relativeUrl.substring(1);
    }

    return gosuArena.url.baseUrl + relativeUrl;
};