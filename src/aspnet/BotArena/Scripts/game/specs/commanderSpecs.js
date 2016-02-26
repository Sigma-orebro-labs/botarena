///<reference path="~/Scripts/_references.js" />

describe("Game", function () {

    var setup = gosuArena.specs.createGameSetup();

    beforeEach(setup.beforeEach);
    afterEach(setup.afterEach);

    describe("Bot", function () {

        it("executing bot command on the engine calls corresponding user defined unction on the bot", function() {
            var wasMethodCalled = false;

            setup.addBot({
                id: 1,
                tick: function() {
                },
                commands: {
                    someCommand: function() {
                        wasMethodCalled = true;
                    }
                }
            });

            setup.startGame();
            setup.clock.doTick();

            gosuArena.engine.executeBotCommand(1, "someCommand");

            expect(wasMethodCalled).toBe(true);
        });

        it("executing command that does not exist does not cause script errors", function () {
            var wasMethodCalled = false;

            setup.addBot({
                id: 1,
                tick: function () {
                },
                commands: {
                    someCommand: function () {
                        wasMethodCalled = true;
                    }
                }
            });

            setup.startGame();
            setup.clock.doTick();

            gosuArena.engine.executeBotCommand(1, "nonExistingCommand");

            expect(wasMethodCalled).toBe(false);
        });

        it("command gets passed status, actionQueue and augmentations", function () {
            var wasMethodCalled = false;

            setup.addBot({
                id: 456,
                tick: function (actionQueue, status) {
                    actionQueue.turn(100);
                },
                commands: {
                    someCommand: function (actionQueue, status, augmentations) {
                        wasMethodCalled = true;

                        expect(actionQueue).toBeTruthy();
                        expect(status).toBeTruthy();
                        expect(augmentations).toBeTruthy();

                        expect(actionQueue.length()).toBe(98); // 100 actions queued minus two actions executed
                        expect(status.id).toBe(456);
                        expect(augmentations.damageBoost).toBeTruthy();
                    }
                },
                augmentations: ["damageBoost"]
            });

            setup.startGame();
            setup.clock.doTick();

            gosuArena.engine.executeBotCommand(456, "someCommand");

            expect(wasMethodCalled).toBe(true);
        });
    });
});
