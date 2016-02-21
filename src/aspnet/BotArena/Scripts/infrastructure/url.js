var gosuArena = gosuArena || {};
gosuArena.url = gosuArena.url || {};

(function() {
    function trimEnd(input, charToTrim) {
        if (input[input.length - 1] === charToTrim) {
            return input.substr(0, input.length - 1);
        }

        return input;
    }

    gosuArena.url.createAbsoluteWithCacheBusting = function (relativeUrl, queryParameters) {
        queryParameters = queryParameters || {};
        queryParameters.v = gosuArena.url.cacheBustingFragment;

        relativeUrl = trimEnd(relativeUrl, '/');

        return gosuArena.url.createAbsolute(relativeUrl, queryParameters);
    }

    gosuArena.url.createAbsolute = function (relativeUrl, queryParameters) {

        function hasLeadingSlash(s) {
            return /^\//.test(s);
        }

        if (hasLeadingSlash(relativeUrl)) {
            relativeUrl = relativeUrl.substring(1);
        }

        if (queryParameters) {
            if (relativeUrl.indexOf('?') < 0) {
                relativeUrl += "?";
            }

            for (var paramName in queryParameters) {

                if (relativeUrl[relativeUrl.length - 1] !== "?") {
                    relativeUrl += "&";
                }

                relativeUrl += paramName + "=" + encodeURIComponent(queryParameters[paramName]);
            }
        }

        return gosuArena.url.baseUrl + relativeUrl;
    };
})();