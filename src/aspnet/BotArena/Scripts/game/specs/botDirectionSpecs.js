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

        it("has no initial direction", function() {

            var wasTickCalled = false;

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function(actionQueue, status) {
                    wasTickCalled = true;
                    expect(status.previousRoundDirection).toEqualVector({ x: 0, y: 0 });
                }
            });

            startGame();

            clock.doTick();

            expect(wasTickCalled).toBe(true);

        });

        it("has no direction after standing still during a round", function () {

            var roundCount = 0;

            addBot({
                startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
                tick: function (actionQueue, status) {

                    if (roundCount === 0) {
                        actionQueue.forward();
                    } else if (roundCount === 1) {
                        // Movement in the first round was forward, which was to the east
                        expect(status.previousRoundDirection).toEqualVector({ x: 1, y: 0 });
                    } else if (roundCount > 1) {
                        // There was no movement in the second round
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: 0 });
                    }

                    roundCount++;
                }
            });

            startGame();

            clock.doTick(3);

            expect(roundCount).toBe(3);
        });

        it("has direction south when moving south, north when moving north, etc.", function () {

            var roundCount = 0;

            addBot({
                startPosition: { x: 100, y: 100, angle: 45 },
                tick: function (actionQueue, status) {

                    if (roundCount === 0) {
                        actionQueue.south();
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: 0 });
                    } else if (roundCount === 1) {
                        actionQueue.north();
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: 1 });
                    } else if (roundCount === 2) {
                        actionQueue.east();
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: -1 });
                    } else if (roundCount === 3) {
                        actionQueue.west();
                        expect(status.previousRoundDirection).toEqualVector({ x: 1, y: 0 });
                    } else if (roundCount === 4) {
                        expect(status.previousRoundDirection).toEqualVector({ x: -1, y: 0 });
                    }

                    roundCount++;
                }
            });

            startGame();

            clock.doTick(5);

            expect(roundCount).toBe(5);
        });

        it("has direction which is absolute, even when moving relative to bot", function () {

            var roundCount = 0;

            addBot({
                startPosition: { x: 100, y: 100, angle: 0 }, // aiming south
                tick: function (actionQueue, status) {

                    if (roundCount === 0) {
                        actionQueue.forward();
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: 0 });
                    } else if (roundCount === 1) {
                        actionQueue.back();
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: 1 });
                    } else if (roundCount === 2) {
                        actionQueue.left();
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: -1 });
                    } else if (roundCount === 3) {
                        actionQueue.right();
                        expect(status.previousRoundDirection).toEqualVector({ x: 1, y: 0 });
                    } else if (roundCount === 4) {
                        expect(status.previousRoundDirection).toEqualVector({ x: -1, y: 0 });
                    }

                    roundCount++;
                }
            });

            startGame();

            clock.doTick(5);

            expect(roundCount).toBe(5);
        });

        it("combines all movement actions during a round to calculate total direction vector", function () {

            var roundCount = 0;

            addBot({
                startPosition: { x: 100, y: 100, angle: 270 }, // aiming east
                tick: function (actionQueue, status) {

                    if (roundCount === 0) {
                        actionQueue.north();
                        actionQueue.east();
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: 0 });
                    } else if (roundCount === 1) {
                        actionQueue.south();
                        actionQueue.south();
                        expect(status.previousRoundDirection).toEqualVector({ x: 1, y: -1 });
                    } else if (roundCount === 2) {
                        expect(status.previousRoundDirection).toEqualVector({ x: 0, y: 2 });
                    }

                    roundCount++;
                }
            });

            startGame();

            clock.doTick(3);

            expect(roundCount).toBe(3);
        });
    });
});
