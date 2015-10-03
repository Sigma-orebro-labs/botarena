///<reference path="~/Scripts/_references.js" />

describe("bot", function () {
    var nextTickAction = function () { };
    var collisionDetector = null;
    var actionQueue = null;

    var tick = function () {
        nextTickAction();
    };

    // Performs a tick for the given bot where the bot
    // will execute the given action during the tick,
    // if the default tick function is used
    function tickWith(bot, action) {
        nextTickAction = action;

        bot.tick();

        nextTickAction = function () { };
    }

    function createOptions(options) {

        options.initialMovementSpeed = options.initialMovementSpeed || 1;

        return options;
    }

    beforeEach(function () {
        collisionDetector = {
            seenBots: function () {
                return [];
            },
            canPerformMoveAction: function () {
                return true;
            }
        };

        actionQueue = gosuArena.factories.createActionQueue(actionQueue);
    });


    /* When referencing the cardinal directions (north, south, ...) they
       are aligned as follows: North = positive y, East = positive x
    */

    it("moves 1 distance unit north when moving forward with angle 0", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: 0,
            y: 0,
            angle: 0
        }));

        bot.moveForward();

        expect(bot.position()).toEqualPoint({ x: 0, y: 1 });
    });

    it("moves 1 distance unit north west when moving forward with angle 45", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: 1,
            y: 2,
            angle: 45
        }));

        bot.moveForward();

        expect(bot.position()).toEqualPoint({
            x: 1 - 1/Math.sqrt(2),
            y: 2 + 1/Math.sqrt(2)
        });
    });

    it("notifies listeners when weapon is fired", function () {
        var wasNotified = 0;

        var bot = gosuArena.factories.createBot(tick, {
            weaponCooldownTime: 2
        });

        bot.onShotFired(function () {
            wasNotified = true;
        });

        bot.fire();

        expect(wasNotified).toEqual(true);
    });

    it("only fires weapon when weapon has had time to cool down after last firing", function () {
        var shotsFired = 0;

        var bot = gosuArena.factories.createBot(tick, {
            weaponCooldownTime: 2
        }, {
            seenBots: function () {
                return [];
            },
            canPerformMoveAction: function () {
                return true;
            }
        });

        bot.onShotFired(function () {
            shotsFired++;
        });

        // Round 1
        bot.fire();
        bot.tick();

        // Round 2, cooldown: 2
        bot.fire();
        bot.tick();

        // Round 3, cooldown: 1
        bot.fire();
        bot.tick();

        // Round 4, cooldown: 0, so now a new shot should be fired
        bot.fire();
        bot.tick();

        expect(shotsFired).toEqual(2);
    });

    it("considers x value of left-most corner to be its left position", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: 1,
            y: 2,
            width: 3.5,
            height: 4,
            angle: 0
        }));

        expect(bot.left()).toEqual(1);
        expect(bot.right()).toEqual(4.5);
        expect(bot.top()).toEqual(6);
        expect(bot.bottom()).toEqual(2);
    });

    it("takes rotation into account when determining top, bottom, left and right", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: 1,
            y: 2,
            width: 2,
            height: 2,
            angle: 45
        }));

        // center is at (2,3)
        expect(bot.left()).toBeCloseTo(2 - Math.sqrt(2));
        expect(bot.right()).toBeCloseTo(2 + Math.sqrt(2));
        expect(bot.top()).toBeCloseTo(3 + Math.sqrt(2));
        expect(bot.bottom()).toBeCloseTo(3 - Math.sqrt(2));
    });

    it("has weapong mounting point is at the top side of the bot, offset from middle", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: 1,
            y: 2,
            width: 3,
            height: 5,
            angle: 0,
            weaponOffsetDistanceFromCenter: 0.1
        }));

        expect(bot.weapon.mountingPoint()).toEqualPoint({ x: 2.6, y: 7 });
    });

    it("takes rotation into account when determining weapon mounting point", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: -1,
            y: -1,
            width: 2,
            height: 2,
            angle: 45,
            weaponOffsetDistanceFromCenter: 0
        }));

        expect(bot.weapon.mountingPoint()).toEqualPoint({
            x: -1/Math.sqrt(2),
            y: 1/Math.sqrt(2)
        });
    });

    it("weapon mounting point in bot coordinate system is the vector from center to mounting point relative to bot", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: -1,
            y: -1,
            width: 2,
            height: 3,
            angle: 45,
            weaponOffsetDistanceFromCenter: -0.2
        }));

        expect(bot.weapon.botRelativeMountingPoint()).toEqualPoint({ x: -0.2, y: 1.5 });
    });

    it("weapon muzzle is at the forward end of the weapon", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: -1,
            y: -1,
            width: 2,
            height: 2,
            angle: 90,
            weaponHeight: 1,
            weaponOffsetDistanceFromCenter: 0.1
        }));

        expect(bot.weapon.muzzlePosition()).toEqualPoint({ x: -2, y: 0.1 });
    });

    it("weapon muzzle point in bot coordinate system is the vector from center to the farthest point of the weapon relative to bot", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: -1.1,
            y: -1,
            width: 2,
            height: 4,
            angle: 270,
            weaponHeight: 1.3,
            weaponOffsetDistanceFromCenter: 0.1            
        }));

        expect(bot.weapon.botRelativeMuzzlePosition()).toEqualPoint({ x: 0.1, y: 3.3 });
    });

    it("raises event when killed", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            initialHealthPoints: 50
        }), collisionDetector);
        var enemyBot = gosuArena.factories.createBot(tick, createOptions({ }));

        var wasKilledEventRaised = false;

        bot.onKilled(function () {
            wasKilledEventRaised = true;
        });

        for (var i = 0; i < 100 && bot.isAlive(); i++) {
            bot.hitBy(gosuArena.factories.createBullet(enemyBot));
        }

        expect(wasKilledEventRaised).toEqual(true);
    });

    it("raises event when hit by bullet", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            initialHealthPoints: 50
        }), collisionDetector);
        var enemyBot = gosuArena.factories.createBot(tick, createOptions({ }));

        var bullet = gosuArena.factories.createBullet(enemyBot);

        var wasHitByBulletEventRaised = false;

        bot.onHitByBullet(function () {
            wasHitByBulletEventRaised = true;
        });

        bot.hitBy(bullet);

        expect(wasHitByBulletEventRaised).toBe(true);
    });

    it("sends bot status with the onHitByBullet event", function () {

        var bot = gosuArena.factories.createBot(tick, createOptions({
            x: 1,
            y: 2,
            angle: 3
        }), collisionDetector);
        var enemyBot = gosuArena.factories.createBot(tick, createOptions({ }));

        var bullet = gosuArena.factories.createBullet(enemyBot);

        bot.onHitByBullet(function (actionQueue, status, augmentations, eventArgs) {
            expect(status.position.x).toEqual(1);
            expect(status.position.y).toEqual(2);
            expect(status.angle).toEqual(3);
        });

        bot.hitBy(bullet);
    });

    it("sends north-east as angle from which the bullet came with the onHitByBullet event when hit by bullet travelling south-west", function () {

        var bot = gosuArena.factories.createBot(tick, createOptions({ }), collisionDetector);
        var enemyBot = gosuArena.factories.createBot(tick, createOptions({
            angle: 45
        }));

        var bullet = gosuArena.factories.createBullet(enemyBot);

        var actualAngle = null;

        bot.onHitByBullet(function (actionQueue, status, augmentations, eventArgs) {
            actualAngle = eventArgs.angle;
        });

        bot.hitBy(bullet);

        expect(actualAngle).toEqual(225);
    });

    it("sends south-west as angle from which the bullet came with the onHitByBullet event when hit by bullet travelling north-east", function () {

        var bot = gosuArena.factories.createBot(tick, createOptions({ }), collisionDetector);
        var enemyBot = gosuArena.factories.createBot(tick, createOptions({
            angle: 135
        }));

        var bullet = gosuArena.factories.createBullet(enemyBot);

        var actualAngle = null;

        bot.onHitByBullet(function (actionQueue, status, augmentations, eventArgs) {
            actualAngle = eventArgs.angle;
        });

        bot.hitBy(bullet);

        expect(actualAngle).toEqual(315);
    });

    it("includes actionsPerRound in the bot status", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            actionsPerRound: 123
        }), collisionDetector);

        var status = bot.createStatus();

        expect(status.actionsPerRound).toEqual(123);
    });

    it("includes health in the bot status", function() {
        var bot = gosuArena.factories.createBot(tick, createOptions({
            initialHealthPoints: 12
        }), collisionDetector);

        var status = bot.createStatus();

        expect(status.health).toEqual(12);
    });
    
    it("only exposes performNext on the action queue of the bot, not on the queue sent to the tick callback", function () {

        var wasTickCalled = false;

        var bot = gosuArena.factories.createBot(function (actionQueue, status) {

            expect(actionQueue.performNext).toBe(undefined);

            wasTickCalled = true;

        }, { }, collisionDetector);

        bot.tick();

        expect(wasTickCalled).toBe(true);
        expect(actionQueue.performNext).toBeDefinedFunction();
    });

    it("only exposes performNext on the action queue of the bot, not on the queue sent to the onHitByBullet callback", function () {
        var bot = gosuArena.factories.createBot(tick, createOptions({ }), collisionDetector);
        var enemyBot = gosuArena.factories.createBot(tick, createOptions({
            angle: 135
        }));

        var bullet = gosuArena.factories.createBullet(enemyBot);

        var wasCallbackCalled = false;

        bot.onHitByBullet(function (actionQueue, status, augmentations, eventArgs) {

            expect(actionQueue.performNext).toBe(undefined);

            wasCallbackCalled = true;
        });

        bot.hitBy(bullet);

        expect(wasCallbackCalled).toBe(true);
        expect(actionQueue.performNext).toBeDefinedFunction();
    });

    it("uses default color if user supplies non-hex value as color", function () {

        var safeOptions = gosuArena.factories.createSafeBotOptions({
            color: "function () { }" // invalid color value
        });

        var bot = gosuArena.factories.createBot(tick, safeOptions, collisionDetector);

        var defaultOptions = gosuArena.factories.createSafeBotOptions({});

        expect(bot.color).toEqual(defaultOptions.color);
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
