var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createBotSelectionViewModel = function (bot) {
    return {
        id: bot.id,
        name: bot.name,
        isSelected: ko.observable(),
        authorDescription: "by " + bot.authorUsername
    };
};
