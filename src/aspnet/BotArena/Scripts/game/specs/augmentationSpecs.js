///<reference path="~/Scripts/_references.js" />

describe("Game", function () {
    var clock = null;

    var arenaState = null;

    var arenaStateInterceptor = {
        initialize: function (state) {
            arenaState = state;
        }
    };

    function startGame() {
        gosuArena.specs.game.startGame(clock);
    }

    var addBot = gosuArena.specs.game.addBot;

    beforeEach(function () {

        jasmine.addMatchers(gosuArena.specs.matchers);

        clock = gosuArena.gameClock.createFake();

        gosuArena.specs.game.cleanup();

        gosuArena.specs.game.initializeWorld([arenaStateInterceptor]);
    });

    afterEach(function() {
        arenaState.unsubscribeAllEventListeners();
    });

    describe("Bot", function () {

        it("is visible when no augmentations are active", function() {
            var wasTickCalled = false;

            addBot({
                tick: function(actionQueue, status) {
                    expect(status.isVisible).toBe(true);
                    expect(arenaState.bots[0].isVisible()).toBe(true);
                    wasTickCalled = true;
                }
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("gets passed augmentations as a parameter to the tick function", function () {
            var wasTickCalled = false;

            addBot({
                tick: function (actionQueue, status, augmentations) {
                    expect(augmentations).toBeTruthy();
                    wasTickCalled = true;
                }
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("gets passed augmentations as a parameter to the onHitByBullet event handler", function () {
            var wasHitByBullet = false;

            addBot({
                startPosition: { x: 70, y: 0, angle: 90  }, // aiming west
                tick: function (actionQueue, status, augmentations) {
                    actionQueue.clear();
                    actionQueue.fire();
                }
            });

            addBot({
                startPosition: { x: 0, y: 0 },
                onHitByBullet: function (actionQueue, status, augmentations, eventArgs) {

                    expect(augmentations).toBeTruthy();

                    wasHitByBullet = true;
                }
            });

            startGame();

            for (var i = 0; i < 50; i++) {
                clock.doTick();
            }

            expect(wasHitByBullet).toBe(true);
        });

        it("gets passed augmentations as a parameter to the onCollision event handler", function () {
            var wasCollidedCallbackCalledForBot1 = false;
            var wasCollidedCallbackCalledForBot2 = false;

            addBot({
                startPosition: { x: 70, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status, augmentations) {
                    actionQueue.clear();
                    actionQueue.forward();
                }, onCollision: function (actionQueue, status, augmentations) {

                    expect(augmentations).toBeTruthy();
                    expect(augmentations.repair).toBeTruthy();
                    expect(augmentations.cloak).toBe(undefined);

                    wasCollidedCallbackCalledForBot1 = true;
                },
                augmentations: ['repair']
            });

            addBot({
                startPosition: { x: 0, y: 0 },
                onCollision: function (actionQueue, status, augmentations) {

                    expect(augmentations).toBeTruthy();
                    expect(augmentations.cloak).toBeTruthy();
                    expect(augmentations.repair).toBe(undefined);

                    wasCollidedCallbackCalledForBot2 = true;
                },
                augmentations: ["cloak"]
            });

            startGame();

            clock.doTick(200);

            expect(wasCollidedCallbackCalledForBot1).toBe(true);
            expect(wasCollidedCallbackCalledForBot2).toBe(true);
        });

        it("becomes invisible during a number of rounds when the cloak augmentation is activated", function() {
            var wasTickCalled = false;
            var roundCount = 0;
            var cloakDuration;

            addBot({
                tick: function (actionQueue, status, augmentations) {

                    // Activate the cloak during the second round to let the other bot see this one during the first round
                    if (roundCount == 0) {
                        augmentations.cloak.activate();
                    }

                    if (roundCount > 0 && roundCount < cloakDuration) {
                        expect(status.isVisible).toBe(false);
                        expect(arenaState.bots[0].isVisible()).toBe(false);

                    // The augmentations are ticked after the bot, so an extra round is needed for the augmentation to become inactive again
                    } else if (roundCount > cloakDuration) { 
                        expect(status.isVisible).toBe(true);
                        expect(arenaState.bots[0].isVisible()).toBe(true);
                    }

                    wasTickCalled = true;
                    roundCount++;
                },
                augmentations: ["cloak"]
            });

            startGame();

            cloakDuration = arenaState.bots[0].augmentations().cloak.roundsRemaining();

            for (var i = 0; i < cloakDuration + 10; i++) {
                clock.doTick();
            }

            expect(wasTickCalled).toBe(true);
        });

        it("cannot be seen by enemies when cloaked", function () {
            var wasTick1Called = false, wasTick2Called = false;
            var roundCount = 0;
            var cloakDuration;

            addBot({
                startPosition: { x: 0, y: 0 },
                tick: function (actionQueue, status, augmentations) {

                    if (roundCount === 1) {
                        augmentations.cloak.activate();
                    }

                    wasTick1Called = true;
                },
                augmentations: ["cloak"]
            });

            addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status) {
                    if (roundCount === 0) {
                        expect(status.seenEnemies.length).toBe(1);
                    } else if (roundCount < cloakDuration) {
                        expect(status.seenEnemies.length).toBe(0);
                    } else if (roundCount > cloakDuration) {
                        expect(status.seenEnemies.length).toBe(1);
                    }

                    wasTick2Called = true;
                    roundCount++;
                }
            });

            startGame();

            cloakDuration = arenaState.bots[0].augmentations().cloak.roundsRemaining();

            for (var i = 0; i < cloakDuration + 10; i++) {
                clock.doTick();
            }

            expect(wasTick1Called).toBe(true);
            expect(wasTick2Called).toBe(true);
        });

        it("which is damaged gradually regains health when repair is triggered", function () {

            var isRepairFinished = false;
            var expectedDamage;
            var shotsFired = 0;
            var shotCountToFire = 8;
            var healthSamplesDuringRepair = [];

            addBot({
                startPosition: { x: 0, y: 0 },
                tick: function (actionQueue, status, augmentations) {

                    isRepairFinished = augmentations.repair.roundsRemaining() === 0;

                    if (status.health === status.maxHealth - expectedDamage && !augmentations.repair.isActive()) {
                        augmentations.repair.activate();
                    }

                    if (augmentations.repair.isActive()) {
                        healthSamplesDuringRepair.push(status.health);
                    }
                },
                augmentations: ["repair"]
            });

            addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status) {
                    if (status.canFire() && shotsFired < shotCountToFire) {
                        actionQueue.fire();
                        shotsFired++;
                    }
                }
            });

            startGame();

            var repairingBot = arenaState.bots[0];
            var normalBot = arenaState.bots[1];

            expectedDamage = normalBot.weapon.calculateDamage() * shotCountToFire;

            for (var i = 0; i < 1000 && !isRepairFinished; i++) {
                clock.doTick();
            }

            expect(repairingBot.health()).toBeLessThan(repairingBot.maxHealth);
            expect(repairingBot.health()).toBeGreaterThan(repairingBot.maxHealth - expectedDamage);
            expect(healthSamplesDuringRepair.length).toBeGreaterThan(0);

            for (var j = 1; j < healthSamplesDuringRepair.length; j++) {

                // Make sure the health increases gradualy after the repair has been triggered.
                expect(healthSamplesDuringRepair[j] >= healthSamplesDuringRepair[j - 1]).toBe(true);
            }
        });

        it("cannot be repaired above max health", function() {

            addBot({
                startPosition: { x: 0, y: 0 },
                tick: function(actionQueue, status, augmentations) {

                    if (!augmentations.repair.isActive()) {
                        augmentations.repair.activate();
                    }
                },
                augmentations: ["repair"]
            });

            startGame();

            var repairingBot = arenaState.bots[0];

            for (var i = 0; i < 100; i++) {
                clock.doTick();
            }

            expect(repairingBot.health()).toBe(repairingBot.maxHealth);
        });

        it("raises activated/deactivated events for augmentation through arenaState", function () {

            var roundCount = 0;
            var wasDeactivatedEventRaised = false;
            var wasActivatedEventRaised = false;
            var deactivatedRound = null;
            var activatedRound = null;
            var repairingBot;

            addBot({
                startPosition: { x: 0, y: 0 },
                tick: function (actionQueue, status, augmentations) {

                    roundCount++;

                    if (!augmentations.repair.isActive()) {
                        augmentations.repair.activate();
                    }
                },
                augmentations: ["repair"]
            });

            arenaState.onBotAugmentationActivated(function (bot, augmentation) {
                wasActivatedEventRaised = true;
                activatedRound = roundCount;

                expect(bot).toBe(repairingBot);
                expect(augmentation.id).toBe("repair");
            });

            arenaState.onBotAugmentationDeactivated(function (bot, augmentation) {
                wasDeactivatedEventRaised = true;
                deactivatedRound = roundCount;

                expect(bot).toBe(repairingBot);
                expect(augmentation.id).toBe("repair");
            });

            startGame();

            repairingBot = arenaState.bots[0];

            for (var i = 0; i < 1000; i++) {
                clock.doTick();
            }

            expect(wasActivatedEventRaised).toBe(true);
            expect(wasDeactivatedEventRaised).toBe(true);
            expect(deactivatedRound).toBeGreaterThan(activatedRound);
        });

        it("with active damage boost deals more damage", function () {

            var hasNormalBotFired = false,
                hasHighDamageBotFired = false,
                wasNormalBotHit = false,
                wasHighDamageBotHit = false;

            // Let the two bots fire a single shot at each other and see what damage they take

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function (actionQueue, status) {

                    if (!hasNormalBotFired) {
                        actionQueue.fire();
                        hasNormalBotFired = true;
                    }
                },
                onHitByBullet: function (actionQueue, status) {
                    wasNormalBotHit = true;
                }
            });

            addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status, augmentations) {

                    if (!augmentations.damageBoost.isActive()) {
                        augmentations.damageBoost.activate();
                    }

                    if (!hasHighDamageBotFired) {
                        actionQueue.fire();
                        hasHighDamageBotFired = true;
                    }
                },
                onHitByBullet: function (actionQueue, status) {
                    wasHighDamageBotHit = true;
                },
                augmentations: ["damageBoost"]
            });

            startGame();

            var normalBot = arenaState.bots[0];
            var highDamageBot = arenaState.bots[1];

            clock.doTick(20);

            expect(wasNormalBotHit).toBe(true);
            expect(wasHighDamageBotHit).toBe(true);

            expect(highDamageBot.health()).toBeGreaterThan(normalBot.health());
        });

        it("with damage boost that has not been activated deals standard damage", function() {

            var hasNormalBotFired = false,
                hasHighDamageBotFired = false,
                wasNormalBotHit = false,
                wasHighDamageBotHit = false;

            // Let the two bots fire a single shot at each other and see what damage they take

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function(actionQueue, status) {

                    if (!hasNormalBotFired) {
                        actionQueue.fire();
                        hasNormalBotFired = true;
                    }
                },
                onHitByBullet: function(actionQueue, status) {
                    wasNormalBotHit = true;
                }
            });

            addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function(actionQueue, status) {

                    if (!hasHighDamageBotFired) {
                        actionQueue.fire();
                        hasHighDamageBotFired = true;
                    }
                },
                onHitByBullet: function(actionQueue, status) {
                    wasHighDamageBotHit = true;
                },
                augmentations: ["damageBoost"]
            });

            startGame();

            var normalBot = arenaState.bots[0];
            var highDamageBot = arenaState.bots[1];

            clock.doTick(20);

            expect(wasNormalBotHit).toBe(true);
            expect(wasHighDamageBotHit).toBe(true);

            expect(highDamageBot.health()).toEqual(normalBot.health());
        });

        it("with damage boost that has finished deals standard damage", function () {

            var hasNormalBotFired = false,
                hasHighDamageBotFired = false,
                wasNormalBotHit = false,
                wasHighDamageBotHit = false,
                roundCount = 0;

            // Let the two bots fire a single shot at each other and see what damage they take

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function (actionQueue, status) {

                    roundCount++;

                    if (roundCount > 1000 && !hasNormalBotFired) {
                        actionQueue.fire();
                        hasNormalBotFired = true;
                    }
                },
                onHitByBullet: function (actionQueue, status) {
                    wasNormalBotHit = true;
                }
            });

            addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status, augmentations) {

                    // Activate the damage boost from the start
                    if (!augmentations.damageBoost.isActive()) {
                        augmentations.damageBoost.activate();
                    }

                    // Wait until the damage boost expires before firing
                    if (roundCount > 1000 && !hasHighDamageBotFired) {
                        actionQueue.fire();
                        hasHighDamageBotFired = true;
                    }
                },
                onHitByBullet: function (actionQueue, status) {
                    wasHighDamageBotHit = true;
                },
                augmentations: ["damageBoost"]
            });

            startGame();

            var normalBot = arenaState.bots[0];
            var highDamageBot = arenaState.bots[1];

            clock.doTick(1100);

            expect(wasNormalBotHit).toBe(true);
            expect(wasHighDamageBotHit).toBe(true);

            expect(highDamageBot.health()).toEqual(normalBot.health());
        });
    });
});
