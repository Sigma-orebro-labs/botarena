///<reference path="~/Scripts/_references.js" />

describe("Game", function() {
    var clock = null;

    var defaultBotOptions;
    var defaultClassOptions;
    var tankClassOptions;

    var arenaState = null;

    var arenaStateInterceptor = {
        initialize: function(state) {
            arenaState = state;
        }
    };

    function startGame() {
        gosuArena.specs.game.startGame(clock, [arenaStateInterceptor]);
    }

    var addBot = gosuArena.specs.game.addBot;

    beforeEach(function() {
        defaultBotOptions = gosuArena.factories.createSafeBotOptions();
        defaultClassOptions = gosuArena.factories.classes.default.create();
        tankClassOptions = gosuArena.factories.classes.tank.create();

        clock = gosuArena.gameClock.createFake();

        gosuArena.specs.game.cleanup();
    });

    describe("Bot", function() {

        it("with default class has default health points", function() {
            addBot({
                botClass: "default"
            });

            startGame();

            var bot = arenaState.bots[0];

            expect(bot.health).toBe(defaultBotOptions.initialHealthPoints);
        });

        it("with tank class has increased health points", function() {
            addBot({
                botClass: "tank"
            });

            startGame();

            var bot = arenaState.bots[0];

            expect(bot.health).toBe(defaultBotOptions.initialHealthPoints * tankClassOptions.hpFactor);
        });

    });
});