///<reference path="~/Scripts/_references.js" />

describe("Game", function () {
    var originalClassFactory = gosuArena.factories.modifiers.createClassFromOptions;
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

        gosuArena.factories.modifiers.createClassFromOptions = function(botClassName) {

            var override = overrides[botClassName];

            if (!override) {
                return originalClassFactory(botClassName);
            }

            var defaultClass = gosuArena.factories.modifiers.classes.default.create();

            return override(defaultClass);
        };

    }

    var addBot = gosuArena.specs.game.addBot;

    beforeEach(function () {

        defaultBotOptions = gosuArena.factories.createSafeBotOptions();
        defaultClassOptions = gosuArena.factories.modifiers.classes.default.create();
        tankClassOptions = gosuArena.factories.modifiers.classes.tank.create(defaultClassOptions);

        clock = gosuArena.gameClock.createFake();
    });

    afterEach(function() {
        gosuArena.factories.modifiers.createClassFromOptions = originalClassFactory;
        gosuArena.specs.game.cleanup();
    });

    describe("Bot", function() {

        it("without default setup has default properties", function() {
            addBot({
                botClass: "default"
            });

            startGame();

            var bot = arenaState.bots[0];

            expect(bot.health).toBe(defaultBotOptions.initialHealthPoints);
            expect(bot.movementSpeed).toBe(defaultBotOptions.initialMovementSpeed);
            expect(bot.damageReductionFactor).toBe(defaultBotOptions.initialDamageReductionFactor);
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

        it("with increased damage reduction from class takes less damage", function () {

            stubClassFactory({
                armored: function (factors) {
                    factors.damageReductionFactor = 2;
                    return factors;
                }
            });

            var hasNormalBotFired = false,
                hasArmoredBotFired = false,
                wasNormalBotHit = false,
                wasArmoredBotHit = false,
                normalBotDamageTaken,
                armoredBotDamageTaken,
                normalBotInitialHp,
                armoredBotInitialHp;

            // Let the two bots fire a single shot at each other and see what damage they take

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function (actionQueue, status) {

                    normalBotInitialHp = status.health;

                    if (!hasNormalBotFired) {
                        actionQueue.fire();
                    }

                    hasNormalBotFired = true;
                },
                onHitByBullet: function (actionQueue, status) {
                    normalBotDamageTaken = normalBotInitialHp - status.health;
                    wasNormalBotHit = true;
                },
                botClass: "armored"
            });

            addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status) {

                    armoredBotInitialHp = status.health;

                    if (!hasArmoredBotFired) {
                        actionQueue.fire();
                    }

                    hasArmoredBotFired = true;
                },
                onHitByBullet: function (actionQueue, status) {
                    armoredBotDamageTaken = armoredBotInitialHp - status.health;
                    wasArmoredBotHit = true;
                }
            });

            startGame();

            var armoredBot = arenaState.bots[0];
            var normalBot = arenaState.bots[1];

            clock.doTick(200);

            expect(wasNormalBotHit).toBe(true);
            expect(wasArmoredBotHit).toBe(true);

            expect(armoredBot.health).toBeGreaterThan(normalBot.health);
            expect(normalBotDamageTaken).toBeLessThan(armoredBotDamageTaken);
        });
    });
});