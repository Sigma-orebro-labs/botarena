var gosuArena = gosuArena || {};
gosuArena.facories = gosuArena.facories || {};

gosuArena.factories.createMatchViewModel = function () {

    var isFirstInitialization = true;
    var botLegends = ko.observableArray();

    function sortLegendsByHealth() {
        botLegends.sort(function (a, b) {
            if (b.health() !== a.health()) {
                return b.health() - a.health();
            }

            return a.id - b.id;
        });
    }

    function refresh() {
        botLegends().forEach(function (viewModel) {
            viewModel.refresh();
        });

        sortLegendsByHealth();
    }

    function initialize(arenaState) {

        if (isFirstInitialization) {
            arenaState.onBotAdded(function (bot) {
                var viewModel = gosuArena.factories.createBotViewModel(bot);
                botLegends.push(viewModel);
            });

            arenaState.onBotKilled(function (bot) {
                refresh();
            });

            arenaState.onBotHitByBullet(function (bot) {
                refresh();
            });
        }

        botLegends.removeAll();

        isFirstInitialization = false;
    }

    return {
        botLegends: botLegends,
        initialize: initialize
    };
};
