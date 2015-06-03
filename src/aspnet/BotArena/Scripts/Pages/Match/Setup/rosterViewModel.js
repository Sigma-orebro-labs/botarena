var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createRosterViewModel = function(bots, rosterNumber) {
    var selectedBots = ko.observableArray();
    var filterString = ko.observable();
    var number = ko.observable(rosterNumber);

    var createdBotViewModels = bots.map(function(bot) {
        return gosuArena.factories.createBotSelectionViewModel(bot);
    });

    var botViewModels = ko.observableArray(createdBotViewModels);

    var filteredBots = ko.computed(function() {
        return botViewModels().filter(function(bot) {
            var regex = new RegExp(filterString());
            return regex.test(bot.name) || regex.test(bot.authorName);
        }).sort();
    });

    var visibleBots = ko.computed(function() {
        return _.first(filteredBots(), 50);
    });

    var isResultLimited = ko.computed(function() {
        return visibleBots().length < filteredBots().length;
    });

    var hasSelectedBots = ko.computed(function() {
        return selectedBots().length > 0;
    });

    var isSelectionEmpty = ko.computed(function() {
        return !hasSelectedBots();
    });

    var selectedBotNames = ko.computed(function() {

        var allSelectedBots = [];

        selectedBots().forEach(function(bot) {
            allSelectedBots.push(bot);
        });

        return allSelectedBots.map(function(bot) {
            return bot.name;
        });
    });

    function addBot(bot) {
        selectedBots.push(bot);
        ga.showNotification(bot.name + " was added", { delay: 2000 });
    }

    function removeBot(bot) {
        var index = selectedBots.indexOf(bot);
        selectedBots.splice(index, 1);
    }

    return {
        allBots: botViewModels,
        selectedBots: selectedBots,
        filteredBots: filteredBots,
        visibleBots: visibleBots,
        selectedBotNames: selectedBotNames,
        isResultLimited: isResultLimited,
        filterString: filterString,
        hasSelectedBots: hasSelectedBots,
        isSelectionEmpty: isSelectionEmpty,
        addBot: addBot,
        removeBot: removeBot,
        number: number
    };
};
