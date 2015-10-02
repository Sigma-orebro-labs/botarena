var gosuArena = gosuArena || {};
gosuArena.facories = gosuArena.facories || {};

gosuArena.factories.createBotViewModel = function (bot) {

    var health = ko.observable();
    var isAlive = ko.observable();
    var name = ko.observable();
    var color = ko.observable();
    
    function refresh() {
        health(bot.health);
        isAlive(bot.isAlive());
        name(bot.name);
        color(bot.color);
    }

    var viewModel = {
        id: bot.id,
        bot: bot,
        name: name,
        health: health,
        isAlive: isAlive,
        color: color,
        refresh: refresh
    };

    viewModel.refresh();
    
    return viewModel;
};
