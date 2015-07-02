botArena.factory("botScriptFactoryService", function () {
    return {
        createScripts: function(bots) {
            var scripts = [];
            for(var i = 0; i < bots.length; i++) {
                var bot = bots[i];
                scripts.push(
                    "gosuArena.initiateBotRegistration({" + "\n" +
                    "id:" + bot.Id + "," + "\n" +
                    "name: '" + bot.Name + "'," + "\n" +
                    "teamId: " + bot.TeamId + "," + "\n" +
                    "}, function() {" + "\n" +
                    "var window = {};" + "\n" +
                    "var document = {};" + "\n" +
                    "var alert = function() { };" + "\n" +
                    "var XMLHttpRequest = function() { };" + "\n" +
                    "var jQuery = function () { };" + "\n" +
                    "var $ = function () { };" + "\n" +
                    bot.Script + "\n" +
                    "});"
                );
            }
            return scripts;
        }
    };
});