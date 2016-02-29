///<reference path="~/Scripts/_references.js" />

describe("Modifiers", function () {

    var defaultBotOptions;
    var setup = gosuArena.specs.createGameSetup();

    beforeEach(function() {
        setup.beforeEach();
        defaultBotOptions = gosuArena.factories.createSafeBotOptions();
    });
    
    afterEach(setup.afterEach);

    describe("Bot", function() {

        it("with invalid class name has default properties", function() {
            setup.addBot({
                botClass: "invalidClassName"
            });

            setup.startGame();

            var bot = setup.arenaState.bots[0];

            expect(bot.health()).toBe(defaultBotOptions.initialHealthPoints);
            expect(bot.movementSpeed).toBe(defaultBotOptions.initialMovementSpeed);
            expect(bot.damageReductionFactor).toBe(defaultBotOptions.initialDamageReductionFactor);
        });

        it("with increased damage reduction takes less damage", function () {

            setup.initializeModifiers([
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

            setup.addBot({
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

            setup.addBot({
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

            setup.startGame();

            var normalBot = setup.arenaState.bots[0];
            var armoredBot = setup.arenaState.bots[1];

            setup.clock.doTick(20);

            expect(wasNormalBotHit).toBe(true);
            expect(wasArmoredBotHit).toBe(true);

            expect(armoredBot.health()).toBeGreaterThan(normalBot.health());
            expect(armoredBotDamageTaken).toBe(normalBotDamageTaken / 2);
        });

        it("with increased weapon damage output deals more damage", function() {

            setup.initializeModifiers([
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

            setup.addBot({
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

            setup.addBot({
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

            setup.startGame();

            var normalBot = setup.arenaState.bots[0];
            var highDamageBot = setup.arenaState.bots[1];

            setup.clock.doTick(20);

            expect(wasNormalBotHit).toBe(true);
            expect(wasHighDamageBotHit).toBe(true);

            expect(highDamageBot.health()).toBeGreaterThan(normalBot.health());
            expect(normalBotDamageTaken).toBe(highDamageBotDamageTaken * 2);
        });

        it("with increased movement speed moves faster", function() {

            setup.initializeModifiers([ {
                "type": "bonusEquipment",
                "id": "boosters",
                "name": "Speed bosters",
                "modifiers": {
                    "movementSpeedFactor": 2
                }
            }]);

            setup.addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming west
                tick: function(actionQueue) {
                    actionQueue.forward();
                },
                equipment: ["boosters"]
            });

            setup.addBot({
                startPosition: { x: 0, y: 100, angle: 270 }, // aiming west
                tick: function(actionQueue, status) {
                    actionQueue.forward();
                }
            });

            setup.startGame();

            var fastBot = setup.arenaState.bots[0];
            var normalBot = setup.arenaState.bots[1];

            setup.clock.doTick();

            expect(fastBot.position().x).toBeGreaterThan(0);
            expect(fastBot.position().x).toBe(normalBot.position().x * 2);
        });

        it("with reduced weapon cooldown fires more often", function() {

            setup.initializeModifiers([
                {
                    "type": "weapon",
                    "id": "rapidFireCannons",
                    "name": "Rapid fire cannons",
                    "modifiers": {
                        "weaponCooldownTimeFactor": 0.5
                    }
                }
            ]);

            var normalBotHitCount = 0,
                rapidFireBotHitCount = 0,
                normalBotFiredBulletCount = 0,
                rapidFireBotFiredBulletCount = 0;

            // Let the two bots fire until the fast bot has fired 6 times. The slow one should have fired 3 times by then.

            setup.addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function(actionQueue, status) {

                    if (status.canFire()) {
                        actionQueue.fire();
                        normalBotFiredBulletCount++;
                    }
                },
                onHitByBullet: function (actionQueue, status) {
                    normalBotHitCount++;
                }
            });

            setup.addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function(actionQueue, status) {

                    if (status.canFire()) {
                        actionQueue.fire();
                        rapidFireBotFiredBulletCount++;
                    }
                },
                onHitByBullet: function (actionQueue, status) {
                    rapidFireBotHitCount++;
                },
                botClass: "rapidFireCannons"
            });

            setup.startGame();

            // Add a max of 1000 rounds to avoid infinite loops if the code breaks
            for (var i = 0; i < 1000 && rapidFireBotFiredBulletCount < 8; i++) {
                setup.clock.doTick();
            }

            expect(normalBotFiredBulletCount).toBe(4);
            expect(rapidFireBotFiredBulletCount).toBe(8);

            // Since the rapid fire bot has fired twice as many bullets, more bullets 
            // should have hit the normal bot
            expect(rapidFireBotHitCount).toBeGreaterThan(0);

            // One bullet will not have reached the normal bot since we break when the last bullet was just fired
            expect(normalBotHitCount >= (rapidFireBotHitCount * 2) - 1).toBeTruthy();
            expect(normalBotHitCount <= rapidFireBotHitCount * 2).toBeTruthy();
        });

        it("with increased rotation speed rotates more in one round (when rotating a positive angle)", function() {

            setup.initializeModifiers([
                {
                    "type": "class",
                    "id": "fastRotation",
                    "name": "class name",
                    "modifiers": {
                        "rotationSpeedFactor": 2
                    }
                }
            ]);

            setup.addBot({
                startPosition: { x: 25, y: 25, angle: 0 },
                tick: function(actionQueue, status) {
                    actionQueue.turn(100);
                }
            });

            setup.addBot({
                startPosition: { x: 100, y: 100, angle: 0 },
                tick: function(actionQueue, status) {
                    actionQueue.turn(100);
                },
                botClass: "fastRotation"
            });

            setup.startGame();

            var normalBot = setup.arenaState.bots[0];
            var rotationBot = setup.arenaState.bots[1];

            setup.clock.doTick();

            expect(rotationBot.angle).toBeGreaterThan(normalBot.angle);
        });

        it("with increased rotation speed rotates more in one round (when rotating a negative angle)", function () {

            setup.initializeModifiers([
                {
                    "type": "class",
                    "id": "fastRotation",
                    "name": "class name",
                    "modifiers": {
                        "rotationSpeedFactor": 2
                    }
                }
            ]);

            setup.addBot({
                startPosition: { x: 25, y: 25, angle: 90 },
                tick: function (actionQueue, status) {
                    actionQueue.turn(-100);
                }
            });

            setup.addBot({
                startPosition: { x: 100, y: 100, angle: 90 },
                tick: function (actionQueue, status) {
                    actionQueue.turn(-100);
                },
                botClass: "fastRotation"
            });

            setup.startGame();

            var normalBot = setup.arenaState.bots[0];
            var rotationBot = setup.arenaState.bots[1];

            setup.clock.doTick();

            expect(rotationBot.angle).toBeLessThan(normalBot.angle);
        });

        it("is assigned modifiers accordng to the specified class and equipment", function() {
            setup.initializeModifiers([{
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

            setup.initializeModifiers(originalConfig);

            var modifierConfig = gosuArena.factories.modifiers.getCurrentConfig();

            expect(modifierConfig.length).toBe(2);

            modifierConfig[0].type = "some other type";
            modifierConfig[0].modifiers.movementSpeedFactor = 100;

            expect(originalConfig[0].type).toBe("class");
            expect(originalConfig[0].modifiers.movementSpeedFactor).toBe(0.5);
        });
    });
});