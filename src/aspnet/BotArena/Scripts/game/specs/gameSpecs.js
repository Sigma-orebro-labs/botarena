///<reference path="~/Scripts/_references.js" />

describe("Game", function () {
    var visualizer = null;
    var clock = null;
    var botOptions = null;

    var wallThickness = 10;
    var botWidth = null;
    var botHeight = null;

    var defaultBotOptions = null;
    var defaultClassOptions = null;
    var tankClassOptions = null;

    var arenaState = null;

    var arenaStateInterceptor = {
        initialize: function (state) {
            arenaState = state;
        }
    };

    function startGame() {
        gosuArena.engine.start(clock, {
            isTraining: true,
            listeners: [arenaStateInterceptor, visualizer]
        });
    }

    function addBot(options) {
        console.log(JSON.stringify(options) + "\n");
        options.startPosition = options.startPosition || {};
        options.startPosition.x = options.startPosition.x || 0;
        options.startPosition.y = options.startPosition.y || 0;
        options.startPosition.angle = options.startPosition.angle || 0;

        options.tick = options.tick || function() {};
        options.onHitByBullet = options.onHitByBullet || function () { };

        gosuArena.initiateBotRegistration({
            id: options.id || 1,
            teamId: options.teamId
        }, function () {
            gosuArena.register({
                tick: options.tick,
                onHitByBullet: options.onHitByBullet,
                options: {
                    startPosition: options.startPosition,
                    botClass: options.botClass
                }
            });
        });
    }

    beforeEach(function () {
        gosu.eventAggregator.unsubscribeAll("matchEnded");

        defaultBotOptions = gosuArena.factories.createSafeBotOptions();
        defaultClassOptions = gosuArena.factories.classes.default.create();
        tankClassOptions = gosuArena.factories.classes.tank.create();

        visualizer = {
            initialize: function () { },
            render: function() { },
            arenaHeight: 400,
            arenaWidth: 400,
            wallThickness: wallThickness
        };

        botOptions = gosuArena.factories.createSafeBotOptions({}, true);

        botWidth = botOptions.width;
        botHeight = botOptions.height;

        clock = gosuArena.gameClock.createFake();

        gosuArena.engine.reset();
    });

    describe("Bot", function () {

        it("with default class has default health points", function() {
            addBot({
                botClass: "default"
            });

            startGame();

            var bot = arenaState.bots[0];

            expect(bot.health).toBe(defaultBotOptions.initialHealthPoints);
        });

        it("with tank class has increased health points", function () {
            addBot({
                botClass: "tank"
            });

            startGame();

            var bot = arenaState.bots[0];

            expect(bot.health).toBe(defaultBotOptions.initialHealthPoints * tankClassOptions.hpFactor);
        });

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
                }
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

                    if (roundCount == 1) {
                        augmentations.cloak.activate();
                    }

                    wasTick1Called = true;
                }
            });

            addBot({
                startPosition: { x: 100, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status) {
                    if (roundCount == 0) {
                        expect(status.seenEnemies.length).toBe(1);
                    } else if (roundCount < cloakDuration + 1) {
                        expect(status.seenEnemies.length).toBe(0);

                        // The augmentations are ticked after the bot, so an extra round is needed for the augmentation to become inactive again
                    } else if (roundCount > cloakDuration + 1) {
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

        it("can move forward, back, east, west and north when facing west next to south wall", function () {
            var wasTickCalled = false;

            addBot({
                startPosition: {
                    x: gosuArena.arenaWidth / 2,
                    y: gosuArena.arenaHeight - botWidth,
                    angle: 90
                },
                tick: function(actionQueue, status) {
                    expect(status.canMoveForward()).toEqual(true);
                    expect(status.canMoveBack()).toEqual(true);
                    expect(status.canMoveNorth()).toEqual(true);
                    expect(status.canMoveEast()).toEqual(true);
                    expect(status.canMoveWest()).toEqual(true);
                    expect(status.canMoveSouth()).toEqual(false);
                    expect(status.canMoveLeft()).toEqual(false);
                    expect(status.canMoveRight()).toEqual(true);

                    wasTickCalled = true;
                },
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);

        });

        it("user gets callback when bot collides with other bot", function () {

            var ticker = gosuArena.fakeTicker.create();

            var bot1CollisionCount = 0, bot2CollisionCount = 0, bot3CollisionCount = 0;

            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: ticker.tick,
                    onCollision: function (actionQueue, status) {
                        bot1CollisionCount++;

                        expect(actionQueue.forward).toBeDefinedFunction();
                        expect(status.canMoveForward).toBeDefinedFunction();
                    },
                    options: {
                        startPosition: {
                            x: 0,
                            y: 0,
                            angle: 0
                        }
                    }
                });
            });

            gosuArena.initiateBotRegistration({
                id: 2,
                name: "bot2"
            }, function () {
                gosuArena.register({
                    tick: function () {},
                    onCollision: function () {
                        bot2CollisionCount++;
                    },
                    options: {
                        startPosition: {
                            x: botWidth,
                            y: 0,
                            angle: 0
                        }
                    }
                });
            });

            gosuArena.initiateBotRegistration({
                id: 3,
                name: "bot3"
            }, function () {
                gosuArena.register({
                    tick: function () {},
                    onCollision: function () {
                        bot3CollisionCount++;
                    },
                    options: {
                        startPosition: {
                            x: botWidth / 2,
                            y: botHeight,
                            angle: 0
                        }
                    }
                });
            });


            startGame();

            // Round 1
            ticker.setNextAction(function (actionQueue) {
                actionQueue.east(); // Should cause collision with bot2
            });

            clock.doTick();

            expect(bot1CollisionCount).toEqual(1);
            expect(bot2CollisionCount).toEqual(1);
            expect(bot3CollisionCount).toEqual(0);


            // Round 2
            ticker.setNextAction(function (actionQueue) { }); // do nothing

            clock.doTick();

            // No new collisions, so all values should be as after round1
            expect(bot1CollisionCount).toEqual(1);
            expect(bot2CollisionCount).toEqual(1);
            expect(bot3CollisionCount).toEqual(0);


            // Round 3
            ticker.setNextAction(function (actionQueue) {
                actionQueue.forward(); // Collide with the bot to the south (bot3)
            });

            clock.doTick();

            expect(bot1CollisionCount).toEqual(2);
            expect(bot2CollisionCount).toEqual(1);
            expect(bot3CollisionCount).toEqual(1);
        });

        it("checking if movement actions can be performed does not generate onCollision events", function () {

            var collisionCount = 0;
            var wasTickCalled = false;

            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {

                        wasTickCalled = true;

                        status.canMoveLeft();
                        status.canMoveRight();
                        status.canMoveBack();
                        status.canMoveForward();
                        status.canMoveNorth();
                        status.canMoveSouth();
                        status.canMoveEast();
                        status.canMoveWest();
                        status.canTurnLeft();
                        status.canTurnRight();
                    },
                    onCollision: function () {
                        collisionCount++;
                    },
                    options: {
                        startPosition: {
                            x: 0,
                            y: 0,
                            angle: 0
                        }
                    }
                });
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);
            expect(collisionCount).toEqual(0);
        });

        it("can move back, east and south when facing west in north west corner", function () {
            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        expect(status.canMoveForward()).toEqual(false);
                        expect(status.canMoveBack()).toEqual(true);
                        expect(status.canMoveNorth()).toEqual(false);
                        expect(status.canMoveEast()).toEqual(true);
                        expect(status.canMoveWest()).toEqual(false);
                        expect(status.canMoveSouth()).toEqual(true);
                        expect(status.canMoveLeft()).toEqual(true);
                        expect(status.canMoveRight()).toEqual(false);
                    },
                    options: {
                        startPosition: {
                            x: 0,
                            y: 0,
                            angle: 90
                        }
                    }
                });
            });

            clock.doTick();
        });

        it("can move forward, west and north when facing north in south east corner", function () {
            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        expect(status.canMoveForward()).toEqual(true);
                        expect(status.canMoveBack()).toEqual(false);
                        expect(status.canMoveNorth()).toEqual(true);
                        expect(status.canMoveEast()).toEqual(false);
                        expect(status.canMoveWest()).toEqual(true);
                        expect(status.canMoveSouth()).toEqual(false);
                        expect(status.canMoveLeft()).toEqual(true);
                        expect(status.canMoveRight()).toEqual(false);
                    },
                    options: {
                        startPosition: {
                            x: gosuArena.arenaWidth - botWidth,
                            y: gosuArena.arenaHeight - botHeight,
                            angle: 180
                        }
                    }
                });
            });

            clock.doTick();
        });

        it("can turn both ways when in the middle of the field", function () {
            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        expect(status.canTurnLeft()).toEqual(true);
                        expect(status.canTurnRight()).toEqual(true);
                    },
                    options: {
                        startPosition: {
                            x: 100,
                            y: 100,
                            angle: 0
                        }
                    }
                });
            });

            clock.doTick();
        });

        it("can not turn at all when in a corner", function () {
            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        expect(status.canTurnLeft()).toEqual(false);
                        expect(status.canTurnRight()).toEqual(false);
                    },
                    options: {
                        startPosition: {
                            x: 0,
                            y: 0,
                            angle: 0
                        }
                    }
                });
            });

            clock.doTick();
        });

        it("receives a tick for each tick of the game", function () {

            var tickCountForBot1 = 0;
            var tickCountForBot2 = 0;

            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        tickCountForBot1++;
                    }
                });
            });

            gosuArena.initiateBotRegistration({
                id: 2,
                name: "bot2"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        tickCountForBot2++;
                    }
                });
            });

            gosuArena.engine.start(clock, {
                isTraining: true,
                listeners: [arenaStateInterceptor, visualizer]
            });

            clock.doTick();

            expect(tickCountForBot1).toBe(1);
            expect(tickCountForBot2).toBe(1);

            clock.doTick();

            expect(tickCountForBot1).toBe(2);
            expect(tickCountForBot2).toBe(2);
        });

        it("gets call to specified hitByBullet callback when the bot is hit by a bullet", function () {
            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) { },
                    onHitByBullet: function (actionQueue, status, augmentations, eventArgs) {

                        expect(actionQueue.left).toBeDefinedFunction();
                        expect(status.angle).toEqual(180);
                        expect(status.position.x).toEqual(2);
                        expect(status.position.y).toEqual(1);
                        expect(eventArgs.angle).toEqual(270);

                        hitByBulletCallbackCount++;
                    },
                    options: {
                        startPosition: {
                            x: 2,
                            y: 1,
                            angle: 180
                        }
                    }
                });
            });

            // This bot spawns aiming directly at the other bot
            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        actionQueue.fire();
                    },
                    options: {
                        startPosition: {
                            x: botWidth + 5,
                            y: 0,
                            angle: 90
                        }
                    }
                });
            });

            startGame();

            var hitByBulletCallbackCount = 0;

            clock.doTick(3);

            expect(hitByBulletCallbackCount).toEqual(1);
        });

        it("includes arena size in bot status of the tick event", function () {

            var wasTickCalled = false;

            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        expect(status.arena.width).toEqual(gosuArena.arenaWidth);
                        expect(status.arena.height).toEqual(gosuArena.arenaHeight);

                        wasTickCalled = true;
                    }
                });
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("can turn a negative amount of degrees", function () {

            var tickCount = 0;

            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {
                        actionQueue.turn(-1);

                        if (tickCount == 1) {
                            expect(status.angle).toEqual(89);
                        }

                        tickCount++;
                    },
                    options: {
                        startPosition: {
                            x: 100,
                            y: 100,
                            angle: 90
                        }
                    }
                });
            });

            startGame();

            clock.doTick();
            clock.doTick();

            expect(tickCount).toEqual(2);
        });


        it("passes statuses of seen bots to tick callback rather than the bots themselves", function () {

            var bot1Position = { x: 1, y: 2 };
            var bot2Position = { x: botWidth + 10, y: 0 };

            addBot({ id: 2, teamId: 2, startPosition: bot1Position });
            addBot({ id: 3, teamId: 3, startPosition: bot2Position });

            var wasTickCalled = false;

            // This bot spawns aiming directly at the two other bots, which are
            // in a straight westward line.
            gosuArena.initiateBotRegistration({
                id: 1,
                teamId: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {

                        expect(status.seenEnemies.length).toEqual(2);

                        // Make sure that the object passed as a seen bot
                        // doesn't have actual move actions defined
                        expect(status.seenEnemies[0].moveForward).toBe(undefined);

                        // Make sure there are seen bots matching the positions
                        // of the actual bots
                        expect(status.seenEnemies.filter(function (b) {
                            return b.position.x == bot1Position.x &&
                                b.position.y == bot1Position.y;
                        }).length).toEqual(1);

                        expect(status.seenEnemies.filter(function (b) {
                            return b.position.x == bot2Position.x &&
                                b.position.y == bot2Position.y;
                        }).length).toEqual(1);

                        wasTickCalled = true;
                    },
                    options: {
                        startPosition: {
                            x: botWidth * 2 + 20,
                            y: 0,
                            angle: 90
                        }
                    }
                });
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("status for seen bots contain direction information", function () {

            var bot1Position = { x: 1, y: 2 };

            addBot({
                id: 1,
                teamId: 2,
                startPosition: bot1Position,
                tick: function (actionQueue, status) {
                        actionQueue.east();
                }
            });

            var wasTickCalled = false;
            var round = 0;

            // This bot spawns aiming directly at the other bot, which is
            // to the west
            gosuArena.initiateBotRegistration({
                id: 1,
                teamId: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {

                        expect(status.seenEnemies.length).toEqual(1);

                        if (round > 0) {
                            expect(status.seenEnemies[0].direction).toEqualVector({ x: 1, y: 0 });
                        }

                        wasTickCalled = true;
                        round++;
                    },
                    options: {
                        startPosition: {
                            x: 100,
                            y: 0,
                            angle: 90
                        }
                    }
                });
            });

            startGame();

            clock.doTick();
            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("status for seen bots contain id and team id", function () {

            var bot1Position = { x: 1, y: 2 };

            gosuArena.initiateBotRegistration({
                id: 1,
                teamId: 2
            }, function () {
                gosuArena.register({
                    tick: function () { },
                    options: {
                        startPosition: {
                            x: bot1Position.x,
                            y: bot1Position.y,
                            angle: 0
                        }
                    }
                });
            });

            var wasTickCalled = false;
            var round = 0;

            // This bot spawns aiming directly at the other bot, which is
            // to the west
            gosuArena.initiateBotRegistration({
                id: 1,
                teamId: 3
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {

                        expect(status.seenEnemies.length).toEqual(1);

                        if (round > 0) {
                            expect(status.seenEnemies[0].id).toEqual(1);
                            expect(status.seenEnemies[0].teamId).toEqual(2);
                        }

                        wasTickCalled = true;
                        round++;
                    },
                    options: {
                        startPosition: {
                            x: 100,
                            y: 0,
                            angle: 90
                        }
                    }
                });
            });

            startGame();

            clock.doTick();
            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("In a team game seenAllies includes all seen bots on the same team and seenEnemies includes all other seen bots", function () {

            // seen
            addBot({ id: 1, teamId: 2, startPosition: { x: 1, y: 10, angle: 0 } });
            addBot({ id: 2, teamId: 3, startPosition: { x: 50, y: 2, angle: 90 } });
            addBot({ id: 3, teamId: 3, startPosition: { x: 100, y: 5, angle: 270 } });
            addBot({ id: 4, teamId: 2, startPosition: { x: 150, y: 2, angle: 180 } });
            addBot({ id: 5, teamId: 4, startPosition: { x: 200, y: 4, angle: 180 } });

            // not seen
            addBot({ id: 6, teamId: 4, startPosition: { x: 300, y: 4, angle: 180 } });
            addBot({ id: 7, teamId: 2, startPosition: { x: 350, y: 2, angle: 0 } });

            var wasTickCalled = false;
            var round = 0;

            // This bot spawns aiming directly at the first four other bots, which are
            // to the west
            gosuArena.initiateBotRegistration({
                id: 5,
                teamId: 3
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {

                        expect(status.seenEnemies.length).toEqual(3);
                        expect(status.seenEnemies).toContainElementMatching(function(bot) { return bot.id = 1; });
                        expect(status.seenEnemies).toContainElementMatching(function(bot) { return bot.id = 4; });
                        expect(status.seenEnemies).toContainElementMatching(function(bot) { return bot.id = 5; });

                        expect(status.seenAllies.length).toEqual(2);
                        expect(status.seenAllies).toContainElementMatching(function (bot) { return bot.id = 2; });
                        expect(status.seenAllies).toContainElementMatching(function (bot) { return bot.id = 3; });

                        wasTickCalled = true;
                    },
                    options: {
                        startPosition: {
                            x: 250,
                            y: 0,
                            angle: 90 // aiming west (negative x)
                        }
                    }
                });
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("In an FFA game seenEnemies includes all seen bots and seenAllies is empty", function () {

            // seen
            addBot({ id: 1, teamId: undefined, startPosition: { x: 1, y: 10, angle: 0 } });
            addBot({ id: 2, teamId: undefined, startPosition: { x: 50, y: 2, angle: 90 } });

            // not seen
            addBot({ id: 3, teamId: undefined, startPosition: { x: 300, y: 4, angle: 180 } });

            var wasTickCalled = false;
            var round = 0;

            // This bot spawns aiming directly at the first four other bots, which are
            // to the west
            gosuArena.initiateBotRegistration({
                id: 4,
                teamId: undefined
            }, function () {
                gosuArena.register({
                    tick: function (actionQueue, status) {

                        expect(status.seenEnemies.length).toEqual(2);
                        expect(status.seenEnemies).toContainElementMatching(function (bot) { return bot.id = 1; });
                        expect(status.seenEnemies).toContainElementMatching(function (bot) { return bot.id = 2; });

                        expect(status.seenAllies).toBeEmpty();

                        wasTickCalled = true;
                    },
                    options: {
                        startPosition: {
                            x: 250,
                            y: 0,
                            angle: 90 // aiming west (negative x)
                        }
                    }
                });
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);
        });

        it("all bots get a unique id, even if they have the same database id", function () {

            gosuArena.initiateBotRegistration({
                id: 1,
                teamId: 2
            }, function () {
                gosuArena.register({
                    tick: function () { }
                });
            });

            gosuArena.initiateBotRegistration({
                id: 1,
                teamId: 3
            }, function () {
                gosuArena.register({
                    tick: function () { }
                });
            });

            gosuArena.initiateBotRegistration({
                id: 2,
                teamId: 3
            }, function () {
                gosuArena.register({
                    tick: function () { }
                });
            });

            startGame();

            var areIdsUnique =
                arenaState.bots[0].uniqueId != arenaState.bots[1].uniqueId &&
                arenaState.bots[0].uniqueId != arenaState.bots[2].uniqueId &&
                arenaState.bots[1].uniqueId != arenaState.bots[2].uniqueId;

            expect(areIdsUnique).toBe(true);
        });

        it("user gets callback with actionQueue and status when bot collides with wall", function () {

            var ticker = gosuArena.fakeTicker.create();

            var collisionCount = 0;

            gosuArena.initiateBotRegistration({
                id: 1,
                name: "bot"
            }, function () {
                gosuArena.register({
                    tick: ticker.tick,
                    onCollision: function (actionQueue, status) {
                        collisionCount++;

                        expect(actionQueue.forward).toBeDefinedFunction();
                        expect(status.canMoveForward).toBeDefinedFunction();
                    },
                    options: {
                        startPosition: {
                            x: 0,
                            y: 0,
                            angle: 0
                        }
                    }
                });
            });

            startGame();

            // Round 1
            ticker.setNextAction(function (actionQueue) {
                actionQueue.west();
            });

            clock.doTick();

            expect(collisionCount).toEqual(1);


            // Round 2
            ticker.setNextAction(function (actionQueue) {
                actionQueue.east();
            });

            clock.doTick();

            // Should not be any collision this round
            expect(collisionCount).toEqual(1);


            // Round 3
            ticker.setNextAction(function (actionQueue) {
                actionQueue.north();
            });

            clock.doTick();

            expect(collisionCount).toEqual(2);
        });
    });

    it("raises gameEnded event when there is only one bot left", function () {
        gosuArena.initiateBotRegistration({
            id : 1,
            name: "loser 1"
        }, function () {
            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    startPosition: {
                        x: 0,
                        y: 0,
                        angle: 0
                    }
                }
            });
        });

        gosuArena.initiateBotRegistration({
            id: 2,
            name: "loser 2"
        }, function () {
            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    startPosition: {
                        x: botWidth + 10,
                        y: 0,
                        angle: 0
                    }
                }
            });
        });

        // Wrap the creation of bot options so that we can modify the default
        // values without messing directly with the internal state of the engine
        // and without having to reimplement the whole createSafeBotOptions
        var defaultCreateSafeBotOptions = gosuArena.factories.createSafeBotOptions;

        gosuArena.factories.createSafeBotOptions = function (userOptions, isTraining) {
            var options = defaultCreateSafeBotOptions(userOptions, isTraining);

            options.weaponDamage = 50;
            options.weaponCooldownTime = 1;

            return options;
        }; // This bot spawns aiming directly at the two other bots, which are
        // in a straight westward line.
        gosuArena.initiateBotRegistration({
            id: 3,
            name: "expected winner"
        }, function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    if (status.canFire) {
                        actionQueue.fire();
                    }
                },
                options: {
                    startPosition: {
                        x: botWidth * 2 + 20,
                        y: 0,
                        angle: 90
                    }
                }
            });
        });

        var hasMatchEnded = false;

        gosuArena.events.matchEnded(function (result) {
            hasMatchEnded = true;

            var livingBots = arenaState.livingBots();

            expect(livingBots.length).toEqual(1);
            expect(livingBots[0].name).toEqual("expected winner");
            expect(result.winner.name).toEqual("expected winner");
        });

        startGame();

        // Tick a bunch of rounds to make sure that the third bot had the time needed
        // to kill the other two bots.
        for (var tickCount = 0; tickCount < 1000 && !hasMatchEnded; tickCount++) {
            clock.doTick();
        }

        expect(hasMatchEnded).toEqual(true);
    });

    it("raises gameEnded event when there is only bots from one team left", function () {
        gosuArena.initiateBotRegistration({
            id : 1,
            teamId: 12,
            name: "winner 1"
        }, function () {
            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    startPosition: {
                        x: 0,
                        y: 0,
                        angle: 0
                    }
                }
            });
        });

        gosuArena.initiateBotRegistration({
            id: 2,
            teamId: 11,
            name: "loser 2"
        }, function () {
            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    startPosition: {
                        x: botWidth + 10,
                        y: 0,
                        angle: 0
                    }
                }
            });
        });

        // Wrap the creation of bot options so that we can modify the default
        // values without messing directly with the internal state of the engine
        // and without having to reimplement the whole createSafeBotOptions
        var defaultCreateSafeBotOptions = gosuArena.factories.createSafeBotOptions;

        gosuArena.factories.createSafeBotOptions = function (userOptions, isTraining) {
            var options = defaultCreateSafeBotOptions(userOptions, isTraining);

            options.weaponDamage = 50;
            options.weaponCooldownTime = 1;

            return options;
        }; // This bot spawns aiming directly at the two other bots, which are
        // in a straight westward line.
        gosuArena.initiateBotRegistration({
            id: 3,
            teamId: 12,
            name: "winner 2"
        }, function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    if (status.canFire) {
                        actionQueue.fire();
                    }
                },
                options: {
                    startPosition: {
                        x: botWidth * 2 + 20,
                        y: 0,
                        angle: 90
                    }
                }
            });
        });

        var hasMatchEnded = false;

        gosuArena.events.matchEnded(function (result) {
            hasMatchEnded = true;

            var livingBots = arenaState.livingBots();

            expect(livingBots.length).toEqual(2);
            expect(result.winner.name).toEqual("12");
            expect(result.winner.type).toEqual("team");
        });

        startGame();

        // Tick a bunch of rounds to make sure that the third bot had the time needed
        // to kill the other two bots.
        for (var tickCount = 0; tickCount < 1000 && !hasMatchEnded; tickCount++) {
            clock.doTick();
        }

        expect(hasMatchEnded).toEqual(true);
    });

    it("raises matchEnded event with team winner when there is only single bot alive in team match", function () {
        gosuArena.initiateBotRegistration({
            id : 1,
            teamId: 11,
            name: "loser 1"
        }, function () {
            gosuArena.register({
                tick: function (actionQueue, status) { },
                options: {
                    startPosition: {
                        x: 0,
                        y: 0,
                        angle: 0
                    }
                }
            });
        });

        // Wrap the creation of bot options so that we can modify the default
        // values without messing directly with the internal state of the engine
        // and without having to reimplement the whole createSafeBotOptions
        var defaultCreateSafeBotOptions = gosuArena.factories.createSafeBotOptions;

        gosuArena.factories.createSafeBotOptions = function (userOptions, isTraining) {
            var options = defaultCreateSafeBotOptions(userOptions, isTraining);

            options.weaponDamage = 50;
            options.weaponCooldownTime = 1;

            return options;
        }; // This bot spawns aiming directly at the two other bots, which are
        // in a straight westward line.
        gosuArena.initiateBotRegistration({
            id: 3,
            teamId: 12,
            name: "winner 2"
        }, function () {
            gosuArena.register({
                tick: function (actionQueue, status) {
                    if (status.canFire) {
                        actionQueue.fire();
                    }
                },
                options: {
                    startPosition: {
                        x: botWidth * 2 + 20,
                        y: 0,
                        angle: 90
                    }
                }
            });
        });

        var hasMatchEnded = false;

        gosuArena.events.matchEnded(function (result) {
            hasMatchEnded = true;

            var livingBots = arenaState.livingBots();

            expect(livingBots.length).toEqual(1);
            expect(result.winner.name).toEqual("12");
            expect(result.winner.type).toEqual("team");
        });

        startGame();

        // Tick a bunch of rounds to make sure that the third bot had the time needed
        // to kill the other two bots.
        for (var tickCount = 0; tickCount < 1000 && !hasMatchEnded; tickCount++) {
            clock.doTick();
        }

        expect(hasMatchEnded).toEqual(true);
    });    
    
    it("Initializes listeners before bot registration when the game starts", function () {
        gosuArena.initiateBotRegistration({
            id: 1,
            name: "bot"
        }, function () {
            gosuArena.register({
                tick: function () { }
            });
        });

        var actualArenaState = null;
        var wasInitializeCalled = false;

        var listener = {
            initialize: function (arenaState) {
                wasInitializeCalled = true;
                actualArenaState = arenaState;
                expect(arenaState.livingBots()).toBeEmpty();
            }
        };

        gosuArena.engine.start(clock, {
            isTraining: true,
            listeners: [visualizer, listener]
        });

        expect(wasInitializeCalled).toBe(true);
        expect(actualArenaState.livingBots()).not.toBeEmpty();
    });

    it("gives bots ids specified during registration", function () {

        gosuArena.initiateBotRegistration({
            id: 11,
            name: "bot1"
        }, function () {
            gosuArena.register({
                tick: function () { }
            });
        });

        gosuArena.initiateBotRegistration({
            id: 22,
            name: "bot2"
        }, function () {
            gosuArena.register({
                tick: function () { }
            });
        });

        startGame();
        
        expect(arenaState.bots.length).toEqual(2);
        expect(arenaState.bots[0].id).toEqual(11);
        expect(arenaState.bots[1].id).toEqual(22);
    });

    it("only one bot can be registered by a user's script'", function () {
        gosuArena.initiateBotRegistration({
            id: 11,
            name: "bot1"
        }, function () {
            gosuArena.register({
                tick: function () { }
            });

            gosuArena.register({
                tick: function () { }
            });
        });

        startGame();

        expect(arenaState.bots.length).toEqual(1);
    });
});
