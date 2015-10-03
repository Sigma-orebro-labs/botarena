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
        tankClassOptions = gosuArena.factories.classes.tank.create(defaultClassOptions);

        clock = gosuArena.gameClock.createFake();

        gosuArena.specs.game.cleanup();
    });

    describe("Bot", function() {

        it("with default class has default properties", function() {
            addBot({
                botClass: "default"
            });

            startGame();

            var bot = arenaState.bots[0];

            expect(bot.health).toBe(defaultBotOptions.initialHealthPoints);
            expect(bot.movementSpeed).toBe(defaultBotOptions.initialMovementSpeed);
        });

        it("with tank class is configured according to the tank class factors", function() {
            addBot({
                botClass: "tank"
            });

            startGame();

            var bot = arenaState.bots[0];

            expect(bot.health).toBe(defaultBotOptions.initialHealthPoints * tankClassOptions.initialHealthPointFactor);
            expect(bot.movementSpeed).toBe(defaultBotOptions.initialMovementSpeed * tankClassOptions.movementSpeedFactor);
        });
    });
});