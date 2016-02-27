///<reference path="~/Scripts/_references.js" />

describe("Game", function () {

    var setup = gosuArena.specs.createGameSetup();

    beforeEach(setup.beforeEach);
    afterEach(setup.afterEach);

    describe("Rules", function () {

        it("is initialized with arenaState and collision detector", function () {

            var wasInitializeCalled = false;

            setup.addBot({
                id: 1,
                tick: function () { }
            });

            var fakeRule = {
                initialize: function(arenaState, collisionDetector) {
                    wasInitializeCalled = true;

                    expect(arenaState).toBeTruthy();
                    expect(arenaState.bots).toBeTruthy();
                    expect(arenaState.bots.length).toBe(1);

                    expect(collisionDetector).toBeTruthy();
                    expect(collisionDetector.collidingBots).toBeDefinedFunction();
                },
                tick: function() {
                }
            };

            setup.startGame({
                rules: [fakeRule]
            });

            expect(wasInitializeCalled).toBe(true);
        });

        it("is ticked once per round", function () {

            var tickCount = 0;

            setup.addBot({
                id: 1,
                tick: function () { }
            });

            var fakeRule = {
                initialize: function() {
                },
                tick: function() {
                    tickCount++;
                }
            };

            setup.startGame({
                rules: [fakeRule]
            });

            setup.clock.doTick(10);

            expect(tickCount).toBe(10);
        });

        it("sudden death teleports bots and reduces the health of the bots with the configured amount after the given number of rounds (repeatedly)", function() {

            setup.addBot({
                id: 1,
                tick: function() {
                }
            });

            setup.addBot({
                id: 2,
                tick: function () {
                }
            });

            var suddenDeathRule =
                gosuArena.rules.createSuddenDeathRule(setup.clock, {
                    roundCount: 100,
                    healthReductionFactor: 0.5,
                    roundCountReductionFactor: 0.5
                });

            setup.startGame({
                rules: [suddenDeathRule]
            });

            var bot1 = setup.arenaState.bots[0];
            var bot2 = setup.arenaState.bots[0];

            var bot1InitialHp = bot1.health();
            var bot2InitialHp = bot1.health();
            var bot1InitialPosition = bot1.center();
            var bot2InitialPosition = bot2.center();

            setup.clock.doTick(90);

            expect(bot1.health()).toBe(bot1InitialHp);
            expect(bot2.health()).toBe(bot2InitialHp);

            expect(bot1.center()).toEqualPoint(bot1InitialPosition);
            expect(bot2.center()).toEqualPoint(bot2InitialPosition);

            setup.clock.doTick(10); // Total 100 rounds

            expect(bot1.health()).toBeCloseTo(bot1InitialHp * 0.5);
            expect(bot2.health()).toBeCloseTo(bot2InitialHp * 0.5);

            expect(bot1.center()).not.toEqualPoint(bot1InitialPosition);
            expect(bot2.center()).not.toEqualPoint(bot2InitialPosition);

            var bot1FirstTeleportPosition = bot1.center();
            var bot2FirstTeleportPosition = bot2.center();

            setup.clock.doTick(90);

            expect(bot1.health()).toBeCloseTo(bot1InitialHp * 0.5);
            expect(bot2.health()).toBeCloseTo(bot2InitialHp * 0.5);

            expect(bot1.center()).toEqualPoint(bot1FirstTeleportPosition);
            expect(bot2.center()).toEqualPoint(bot2FirstTeleportPosition);

            setup.clock.doTick(10); // Total 200 rounds

            expect(bot1.health()).toBeCloseTo(bot1InitialHp * 0.5 * 0.5);
            expect(bot2.health()).toBeCloseTo(bot2InitialHp * 0.5 * 0.5);

            expect(bot1.center()).not.toEqualPoint(bot1FirstTeleportPosition);
            expect(bot2.center()).not.toEqualPoint(bot2FirstTeleportPosition);
        });

        it("sudden death raises event for each triggering", function() {

            var eventFiredCount = 0;

            gosuArena.events.suddenDeath(function(number) {
                eventFiredCount++;
                expect(number).toBe(eventFiredCount);
            });

            setup.addBot({
                id: 1,
                tick: function() {
                }
            });

            setup.addBot({
                id: 2,
                tick: function() {
                }
            });

            var suddenDeathRule =
                gosuArena.rules.createSuddenDeathRule(setup.clock, {
                    roundCount: 100,
                    healthReductionFactor: 0.5,
                    roundCountReductionFactor: 0.5
                });

            setup.startGame({
                rules: [suddenDeathRule]
            });

            setup.clock.doTick(90);

            expect(eventFiredCount).toBe(0);

            setup.clock.doTick(10); // Total 100 rounds

            expect(eventFiredCount).toBe(1);

            setup.clock.doTick(90);

            expect(eventFiredCount).toBe(1);

            setup.clock.doTick(10); // Total 100 rounds

            expect(eventFiredCount).toBe(2);
        });
    });
});
