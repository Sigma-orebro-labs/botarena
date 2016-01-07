///<reference path="~/Scripts/_references.js" />

describe("Game", function () {
    var clock = null;

    var defaultBotOptions;

    var arenaState = null;

    var arenaStateInterceptor = {
        initialize: function(state) {
            arenaState = state;
        }
    };

    function startGame() {
        gosuArena.specs.game.startGame(clock, [arenaStateInterceptor]);
    }

    function initializeModifiers(modifierConfig) {

        gosuArena.factories.modifiers.initialize(modifierConfig);
    }

    var addBot = gosuArena.specs.game.addBot;

    beforeEach(function () {

        jasmine.addMatchers(gosuArena.specs.matchers);

        defaultBotOptions = gosuArena.factories.createSafeBotOptions();

        clock = gosuArena.gameClock.createFake();

        gosuArena.specs.game.initializeWorld([arenaStateInterceptor]);
    });

    afterEach(function() {
        gosuArena.specs.game.cleanup();
    });

    describe("Bot", function() {

        it("with invalid class name has default properties", function() {
            addBot({
                botClass: "invalidClassName"
            });

            startGame();

            var bot = arenaState.bots[0];

            expect(bot.health).toBe(defaultBotOptions.initialHealthPoints);
            expect(bot.movementSpeed).toBe(defaultBotOptions.initialMovementSpeed);
            expect(bot.damageReductionFactor).toBe(defaultBotOptions.initialDamageReductionFactor);
        });

        it("with increased damage reduction takes less damage", function () {

            initializeModifiers([
                {
                    "type": "class",
                    "id": "armored",
                    "name": "Armor name",
                    "modifiers": {
                        "damageReductionFactor": 2
                    }
                }
            ]);

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
                }
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
                },
                botClass: "armored"
            });

            startGame();

            var normalBot = arenaState.bots[0];
            var armoredBot = arenaState.bots[1];

            clock.doTick(20);

            expect(wasNormalBotHit).toBe(true);
            expect(wasArmoredBotHit).toBe(true);

            expect(armoredBot.health).toBeGreaterThan(normalBot.health);
            expect(armoredBotDamageTaken).toBe(normalBotDamageTaken / 2);
        });

        it("with increased weapon damage output deals more damage", function() {

            initializeModifiers([
                {
                    "type": "class",
                    "id": "highDamage",
                    "name": "Speed bosters",
                    "modifiers": {
                        "weaponDamageFactor": 2
                    }
                }
            ]);

            var hasNormalBotFired = false,
                hasHighDamageBotFired = false,
                wasNormalBotHit = false,
                wasHighDamageBotHit = false,
                normalBotDamageTaken,
                highDamageBotDamageTaken,
                normalBotInitialHp,
                highDamageBotInitialHp;

            // Let the two bots fire a single shot at each other and see what damage they take

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function(actionQueue, status) {

                    normalBotInitialHp = status.health;

                    if (!hasNormalBotFired) {
                        actionQueue.fire();
                    }

                    hasNormalBotFired = true;
                },
                onHitByBullet: function(actionQueue, status) {
                    normalBotDamageTaken = normalBotInitialHp - status.health;
                    wasNormalBotHit = true;
                }
            });

            addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function(actionQueue, status) {

                    highDamageBotInitialHp = status.health;

                    if (!hasHighDamageBotFired) {
                        actionQueue.fire();
                    }

                    hasHighDamageBotFired = true;
                },
                onHitByBullet: function(actionQueue, status) {
                    highDamageBotDamageTaken = highDamageBotInitialHp - status.health;
                    wasHighDamageBotHit = true;
                },
                botClass: "highDamage"
            });

            startGame();

            var normalBot = arenaState.bots[0];
            var highDamageBot = arenaState.bots[1];

            clock.doTick(20);

            expect(wasNormalBotHit).toBe(true);
            expect(wasHighDamageBotHit).toBe(true);

            expect(highDamageBot.health).toBeGreaterThan(normalBot.health);
            expect(normalBotDamageTaken).toBe(highDamageBotDamageTaken * 2);
        });

        it("with increased movement speed moves faster", function() {

            initializeModifiers([ {
                "type": "bonusEquipment",
                "id": "boosters",
                "name": "Speed bosters",
                "modifiers": {
                    "movementSpeedFactor": 2
                }
            }]);

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming west
                tick: function(actionQueue) {
                    actionQueue.forward();
                },
                equipment: ["boosters"]
            });

            addBot({
                startPosition: { x: 0, y: 100, angle: 270 }, // aiming west
                tick: function(actionQueue, status) {
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

        it("is assigned modifiers accordng to the specified class and equipment", function() {
            initializeModifiers([{
                "type": "class",
                "id": "tank",
                "name": "tank class name",
                "modifiers": {
                    "movementSpeedFactor": 0.5,
                    "damageReductionFactor": 2,
                    "weaponDamageFactor": 2
                }
            }, {
                "type": "class",
                "id": "ninja",
                "name": "ninja class name",
                "modifiers": {
                    "movementSpeedFactor": 2,
                    "damageReductionFactor": 0.5,
                    "weaponDamageFactor": 1
                }
            }, {
                "type": "bonusEquipment",
                "id": "boosters",
                "name": "Speed bosters",
                "modifiers": {
                    "movementSpeedFactor": 2
                }
            }, {
                "type": "bonusEquipment",
                "id": "armor",
                "name": "Armor name",
                "modifiers": {
                    "damageReductionFactor": 2
                }
            }, {
                "type": "weapon",
                "id": "superCannons",
                "name": "Super cannons",
                "modifiers": {
                    "weaponDamageFactor": 2
                }
            }]);

            var options = gosuArena.factories.createSafeBotOptions({
                botClass: "tank",
                equipment: ["boosters", "armor"]
            });

            expect(options.staticModifiers.modifiers.length).toBe(3);
            expect(options.staticModifiers.modifiers).toContainElementMatching(function (m) {
                return m.id === "tank";
            });
            expect(options.staticModifiers.modifiers).toContainElementMatching(function (m) {
                return m.id === "boosters";
            });
            expect(options.staticModifiers.modifiers).toContainElementMatching(function (m) {
                return m.id === "armor";
            });
        });

        it("changing modifier collection retieved from the modifier factory does not change the orignal config", function () {

            var originalConfig = [
                {
                    "type": "class",
                    "id": "tank",
                    "name": "tank class name",
                    "modifiers": {
                        "movementSpeedFactor": 0.5,
                        "damageReductionFactor": 2,
                        "weaponDamageFactor": 2
                    }
                }, {
                    "type": "class",
                    "id": "ninja",
                    "name": "ninja class name",
                    "modifiers": {
                        "movementSpeedFactor": 2,
                        "damageReductionFactor": 0.5,
                        "weaponDamageFactor": 1
                    }
                }
            ];

            initializeModifiers(originalConfig);

            var modifierConfig = gosuArena.factories.modifiers.getCurrentConfig();

            expect(modifierConfig.length).toBe(2);

            modifierConfig[0].type = "some other type";
            modifierConfig[0].modifiers.movementSpeedFactor = 100;

            expect(originalConfig[0].type).toBe("class");
            expect(originalConfig[0].modifiers.movementSpeedFactor).toBe(0.5);
        });
    });
});