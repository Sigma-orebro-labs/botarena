///<reference path="~/Scripts/_references.js" />

describe("Game", function () {
    var originalClassFactory = gosuArena.factories.classes.createFromOptions;
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

    function stubClassFactory(overrides) {

        gosuArena.factories.classes.createFromOptions = function(options) {

            var override = overrides[options.botClass];

            if (!override) {
                return originalClassFactory(options);
            }

            var defaultClass = gosuArena.factories.classes.default.create();

            return override(defaultClass);
        };

    }

    var addBot = gosuArena.specs.game.addBot;

    beforeEach(function () {

        defaultBotOptions = gosuArena.factories.createSafeBotOptions();
        defaultClassOptions = gosuArena.factories.classes.default.create();
        tankClassOptions = gosuArena.factories.classes.tank.create(defaultClassOptions);

        clock = gosuArena.gameClock.createFake();
    });

    afterEach(function() {
        gosuArena.factories.classes.createFromOptions = originalClassFactory;
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

        it("with increased movement speed from class moves faster", function () {

            stubClassFactory({
                fast: function (factors) {
                    factors.movementSpeedFactor = 2;
                    return factors;
                }
            });

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming west
                tick: function (actionQueue) {
                    actionQueue.forward();
                },
                botClass: "fast"
            });

            addBot({
                startPosition: { x: 0, y: 100, angle: 270 }, // aiming west
                tick: function (actionQueue, status) {
                    actionQueue.forward();
                }
            });

            startGame();

            var fastBot = arenaState.bots[0];
            var normalBot = arenaState.bots[1];

            clock.doTick();

            expect(fastBot.position().x).toBeGreaterThan(0);
            expect(fastBot.position().x).toBe(normalBot.position().x * 2);
        });
    });
});