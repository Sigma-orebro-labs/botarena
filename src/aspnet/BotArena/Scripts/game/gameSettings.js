gosuArena = gosuArena || {};
gosuArena.settings = gosuArena.settings || {};

(function() {
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    gosuArena.settings.isTraining = function() {
        var training = getParameterByName("isTraining");
        return training && training.toLowerCase() == "true";
    };

    gosuArena.settings.showBotNames = function () {
        return document.getElementById("showBotNames").checked;
    };

    gosuArena.settings.showBotSights = function () {
        return document.getElementById("showBotSights").checked;
    };
})();

