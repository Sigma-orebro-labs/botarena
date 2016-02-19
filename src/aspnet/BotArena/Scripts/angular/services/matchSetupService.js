var app = angular.module('menuApp');

app.factory('matchSetupService', [function () {

    function createStartMatchUrl(rosters, options) {

        var rosterQueryValues = [];

        for (var i = 0; i < rosters.length; i++) {

            var selectedBots = rosters[i];

            if (selectedBots.length === 0) {
                continue;
            }

            var selectedBotNames = selectedBots.map(function (bot) { return bot.name });
            var rosterList = selectedBotNames.join(",");

            var rosterQueryValue = encodeURIComponent("rosters[" + i + "]") + "=" + encodeURIComponent(rosterList);

            rosterQueryValues.push(rosterQueryValue);
        }

        var rosterQueryString = rosterQueryValues.join("&");

        var isTeamValue = options.isTeamSetup ? "true" : "false";
        var isTrainingValue = options.isTraining ? "true" : "false";

        return gosuArena.url.createAbsoluteWithCacheBusting("/Match/Play?" + rosterQueryString + "&isTeam=" + isTeamValue + "&isTraining=" + isTrainingValue);
    };

    return {
        createStartMatchUrl: createStartMatchUrl
    };
}]);