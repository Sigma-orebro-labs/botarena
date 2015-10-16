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

        function addBot(bot) {
            var viewModel = gosuArena.factories.createBotViewModel(bot);
            botLegends.push(viewModel);
        }

        botLegends.removeAll();

        if (isFirstInitialization) {

            arenaState.bots.forEach(addBot);

            arenaState.onBotAdded(addBot);

            arenaState.onBotKilled(function (bot) {
                refresh();
            });

            arenaState.onBotHitByBullet(function (bot) {
                refresh();
            });
        }

        isFirstInitialization = false;
    }

    return {
        botLegends: botLegends,
        initialize: initialize
    };
};
