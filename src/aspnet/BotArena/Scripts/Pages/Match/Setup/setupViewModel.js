var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createSetupViewModel = function(bots, rosterCount) {

    var rosterViewModels = [];

    for (var i = 1; i <= rosterCount; i++) {
        var viewModel = gosuArena.factories.createRosterViewModel(bots, i);
        rosterViewModels.push(viewModel);
    }

    var rosters = ko.observableArray(rosterViewModels);

    var currentRosterNumber = ko.observable(1);

    var currentRoster = ko.computed(function() {
        return rosters()[currentRosterNumber() - 1];
    });
    
    var setCurrentRoster = function (rosterNumber) {
        currentRosterNumber(rosterNumber);
    };

    return {
        currentRoster: currentRoster,
        currentRosterNumber: currentRosterNumber,
        setCurrentRoster: setCurrentRoster,
        rosters: rosters,
        selectedBotNames: ko.observableArray()
    };
};
