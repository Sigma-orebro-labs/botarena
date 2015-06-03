var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createSetupViewModel = function(bots, preselectedBots) {
    var createdBotViewModels = bots.map(function(bot) {
        return gosuArena.factories.createBotSelectionViewModel(bot);
    });

    var botViewModels = ko.observableArray(createdBotViewModels);

    var selectedBots = ko.computed(function() {
        return botViewModels().filter(function(bot) {
            return bot.isSelected();
        });
    });

    var selectedBotNames = ko.computed(function() {

        var allSelectedBots = [];

        selectedBots().forEach(function(bot) {
            allSelectedBots.push(bot);
        });

        preselectedBots.forEach(function(bot) {
            allSelectedBots.push(bot);
        });

        return allSelectedBots.map(function(bot) {
            return bot.name;
        });
    });

    function toggleSelection(bot) {
        bot.isSelected(!bot.isSelected());
    }

    return {
        allBots: botViewModels,
        selectedBots: selectedBots,
        selectedBotNames: selectedBotNames,
        toggleSelection: toggleSelection
    };
};
