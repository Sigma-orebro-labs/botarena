var gosuArena = gosuArena || {};
gosuArena.facories = gosuArena.facories || {};

gosuArena.factories.createMatchViewModel = function () {

    var isFirstInitialization = true;
    var botLegends = ko.observableArray();
    var arenaState;

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

    function onBotRegistrationStarting() {
        botLegends.removeAll();
    }

    function addBot(bot) {
        var viewModel = gosuArena.factories.createBotViewModel(bot);
        botLegends.push(viewModel);
    }

    function cameraTargetBot(bot) {
        gosuArena.events.raiseTargetCameraOnBot(bot);
    }

    function initialize(worldArenaState) {

        arenaState = worldArenaState;

        gosuArena.events.botRegistrationStarting(onBotRegistrationStarting);

        arenaState.onBotAdded(addBot);

        arenaState.onBotKilled(function (bot) {
            refresh();
        });

        arenaState.onBotHealthChanged(function (bot) {
            refresh();
        });

        arenaState.onBotHitByBullet(function (bot) {
            refresh();
        });
    }

    return {
        botLegends: botLegends,
        targetBotWithCamera: cameraTargetBot,
        initialize: initialize
    };
};
