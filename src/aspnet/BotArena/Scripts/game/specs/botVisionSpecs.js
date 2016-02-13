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
        it("can see bots within a wider field of vision", function () {
            var wasTickCalled = false;

            addBot({
                startPosition: { x: 200, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status) {
                    wasTickCalled = true;

                    expect(status.enemiesInFieldOfVision).toBeTruthy();
                    expect(status.alliesInFieldOfVision).toBeTruthy();

                    expect(status.enemiesInFieldOfVision.length).toBe(2);
                    expect(status.alliesInFieldOfVision.length).toBe(0);
                }
            });

            // This bot is straight ahead of the first bot
            addBot({
                startPosition: { x: 0, y: 0 },
            });

            // This bot is NOT straight ahead of the first bot, but still in the field of view
            addBot({
                startPosition: { x: 0, y: 40 },
            });

            // This bot straight to the left (south in this case) of the first bot, 
            // so it should not be in the field of view
            addBot({
                startPosition: { x: 200, y: 50 },
            });

            
            // This bot is behind the first bot, so it should not be in the field of view
            addBot({
                startPosition: { x: 300, y: 30 },
            });

            startGame();

            clock.doTick(1);

            expect(wasTickCalled).toBe(true);
        });

        it("differentiates between allies and enemies in the field of vision", function () {
            var wasTickCalled = false;

            addBot({
                id: 1,
                startPosition: { x: 200, y: 0, angle: 90 }, // aiming west
                tick: function (actionQueue, status) {
                    wasTickCalled = true;

                    expect(status.enemiesInFieldOfVision).toBeTruthy();
                    expect(status.alliesInFieldOfVision).toBeTruthy();

                    expect(status.enemiesInFieldOfVision.length).toBe(1);
                    expect(status.alliesInFieldOfVision.length).toBe(1);

                    expect(status.alliesInFieldOfVision[0].id).toBe(2);
                    expect(status.enemiesInFieldOfVision[0].id).toBe(3);
                },
                teamId: 1
            });

            // This bot is straight ahead of the first bot
            addBot({
                id: 2,
                startPosition: { x: 0, y: 0 },
                teamId: 1
            });

            // This bot is NOT straight ahead of the first bot, but still in the field of view
            addBot({
                id: 3,
                startPosition: { x: 0, y: 40 },
                teamId: 2
            });

            startGame();

            clock.doTick(1);

            expect(wasTickCalled).toBe(true);
        });

        it("does NOT see bot that is just outside of the 90 degree field of vision", function () {
            var wasTickCalled = false;

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function (actionQueue, status) {
                    wasTickCalled = true;
                    expect(status.enemiesInFieldOfVision.length).toBe(0);
                }
            });

            addBot({
                startPosition: { x: 100, y: 130 }
            });

            startGame();

            clock.doTick(1);

            expect(wasTickCalled).toBe(true);
        });

        it("does see bot that is just inside of the 90 degree field of vision", function () {
            var wasTickCalled = false;

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function (actionQueue, status) {
                    wasTickCalled = true;
                    expect(status.enemiesInFieldOfVision.length).toBe(1);
                }
            });

            addBot({
                startPosition: { x: 100, y: 90 }
            });

            startGame();

            clock.doTick(1);

            expect(wasTickCalled).toBe(true);
        });
    });
});
