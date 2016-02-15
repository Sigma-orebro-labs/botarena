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

        addBot({
            startPosition: { x: 0, y: 0, angle: 270 }, // aiming east
            tick: function (actionQueue, status) {
                wasTickCalled = true;
                expect(status.enemiesInFieldOfVision.length).toBe(1);
            }
        });

        it("has no direction after standing still during a round", function () {
            var bot = gosuArena.factories.createBot(tick, createOptions({
                x: 0,
                y: 0,
                angle: 0
            }), collisionDetector);

            tickWith(bot, function () { bot.moveForward(); });

            tickWith(bot, function () { }); // Do nothing for one turn

            expect(bot.direction).toEqualVector({ x: 0, y: 0 });
        });

        it("has direction south when moving south, north when moving north, etc.", function () {
            var bot = gosuArena.factories.createBot(tick, createOptions({
                x: 0,
                y: 0,
                angle: 0
            }), collisionDetector);

            expect(bot.direction).toEqualVector({ x: 0, y: 0 });

            tickWith(bot, function () { bot.moveSouth(); });

            expect(bot.direction).toEqualVector({ x: 0, y: 1 });

            tickWith(bot, function () { bot.moveNorth(); });

            expect(bot.direction).toEqualVector({ x: 0, y: -1 });

            tickWith(bot, function () { bot.moveWest(); });

            expect(bot.direction).toEqualVector({ x: -1, y: 0 });

            tickWith(bot, function () { bot.moveEast(); });

            expect(bot.direction).toEqualVector({ x: 1, y: 0 });
        });

        it("has direction which is absolute, even when moving relative to bot", function () {
            var bot = gosuArena.factories.createBot(tick, createOptions({
                x: 0,
                y: 0,
                angle: 0
            }), collisionDetector);

            // Facing north

            expect(bot.direction).toEqualVector({ x: 0, y: 0 });

            tickWith(bot, function () { bot.moveForward(); }); // south

            expect(bot.direction).toEqualVector({ x: 0, y: 1 });

            tickWith(bot, function () { bot.moveBack(); }); // north

            expect(bot.direction).toEqualVector({ x: 0, y: -1 });

            tickWith(bot, function () { bot.moveLeft(); }); // east

            expect(bot.direction).toEqualVector({ x: 1, y: 0 });

            tickWith(bot, function () { bot.moveRight(); }); // west

            expect(bot.direction).toEqualVector({ x: -1, y: 0 });

            tickWith(bot, function () { bot.turn(90); }); // Facing west

            tickWith(bot, function () { bot.moveLeft(); }); // South

            expect(bot.direction).toEqualVector({ x: 0, y: 1 });

            tickWith(bot, function () { bot.moveRight(); }); // north

            expect(bot.direction).toEqualVector({ x: 0, y: -1 });

            tickWith(bot, function () { bot.moveBack(); }); // east

            expect(bot.direction).toEqualVector({ x: 1, y: 0 });

            tickWith(bot, function () { bot.moveForward(); }); // west

            expect(bot.direction).toEqualVector({ x: -1, y: 0 });
        });

        it("combines all movement actions during a round to calculate total direction vector", function () {
            var bot = gosuArena.factories.createBot(tick, createOptions({
                x: 0,
                y: 0,
                angle: 0
            }), collisionDetector);

            tickWith(bot, function () {
                bot.moveNorth();
                bot.moveEast();
            });

            expect(bot.direction).toEqualVector({ x: 1, y: -1 });
        });
    });
});
