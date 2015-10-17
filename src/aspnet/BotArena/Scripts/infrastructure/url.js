var gosuArena = gosuArena || {};
gosuArena.url = gosuArena.url || {};

gosuArena.url.createAbsolute = function(relativeUrl, queryParameters) {

    function hasLeadingSlash(s) {
        return /^\//.test(s);
    }

    if (hasLeadingSlash(relativeUrl)) {
        relativeUrl = relativeUrl.substring(1);
    }

    if (queryParameters) {
        relativeUrl += "?";

        for (var paramName in queryParameters) {

            if (relativeUrl[relativeUrl.length - 1] !== "?") {
                relativeUrl += "&";
            }

            relativeUrl += paramName + "=" + encodeURIComponent(queryParameters[paramName]);
        }
    }

    return gosuArena.url.baseUrl + relativeUrl;
};