var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createBot = function (tickCallback, options, collisionDetector) {

    var shotFiredCallbacks = [];
    var killedCallbacks = [];
    var collisionCallbacks = [];
    var hitByBulletCallbacks = [];
    var actionQueue = gosuArena.factories.createActionQueue(collisionDetector);
    var userActionQueue = gosuArena.factories.createUserActionQueue(actionQueue);
    
    var properties = {
        id: options.id,
        teamId: options.teamId,
        uniqueId: options.uniqueId,
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        angle: options.angle,
        direction: { x: 0, y: 0},
        color: options.color,
        name: options.name,
        actionsPerRound: options.actionsPerRound,
        health: options.initialHealthPoints,
        weapon: {
            width: options.weaponWidth,
            height: options.weaponHeight,
            cooldownTime: options.weaponCooldownTime,
            cooldownTimeLeft: 0,
            damage: options.weaponDamage,
            offsetDistanceFromCenter: options.weaponOffsetDistanceFromCenter
        },
        sight: {
            width: options.sightWidth,
            length: options.sightLength
        }
    };

    var bot = gosuArena.worldObject.create(properties);

    bot.top = function() {
        return bot.rectangle().maxY;
    };

    bot.bottom = function () {
        return bot.rectangle().minY;
    };

    bot.left = function () {
        return bot.rectangle().minX;
    };

    bot.right = function () {
        return bot.rectangle().maxX;
    };

    bot.isAlive = function () {
        return bot.health > 0;
    }

    bot.healthPercentage = function () {
        return bot.health / options.initialHealthPoints;
    };

    bot.weapon.mountingPoint = function() {
        var offsetVectorFromCenter = gosu.math.point.rotate(
            bot.weapon.botRelativeMountingPoint(),
            bot.angle);

        return gosu.math.point.translate(bot.center(), offsetVectorFromCenter);
    };

    bot.weapon.botRelativeMountingPoint = function () {
        return { x: bot.weapon.offsetDistanceFromCenter, y: bot.height / 2 };
    };

    bot.weapon.botRelativeMuzzlePosition = function () {
        return gosu.math.point.add(
            bot.weapon.botRelativeMountingPoint(),
            { x: 0, y: bot.weapon.height });
    };

    bot.weapon.muzzlePosition = function () {
        var offsetVectorFromCenter = gosu.math.point.rotate(
            bot.weapon.botRelativeMuzzlePosition(),
            bot.angle);

        return gosu.math.point.translate(bot.center(), offsetVectorFromCenter);
    };

    bot.position = function () {
        return { x: bot.x, y: bot.y };
    };

    bot.turn = function (degrees) {
        bot.angle = gosu.math.normalizeAngleInDegrees(bot.angle + degrees);
    };

    bot.moveForward = function () {
        moveRelativeToBot({ x: 0, y: 1 });
    };

    bot.moveBack = function () {
        moveRelativeToBot({ x: 0, y: -1 });
    };

    bot.moveLeft = function () {
        moveRelativeToBot({ x: 1, y: 0 });
    };

    bot.moveRight = function () {
        moveRelativeToBot({ x: -1, y: 0 });
    };
    
    bot.moveNorth = function () {
        moveAbsolute({ x : 0, y: -1 });
    };

    bot.moveSouth = function () {
        moveAbsolute({ x : 0, y: 1 });
    };

    bot.moveWest = function () {
        moveAbsolute({ x : -1, y: 0 });
    };

    bot.moveEast = function () {
        moveAbsolute({ x : 1, y: 0 });
    };

    function moveRelativeToBot(vector) {
        var movementVector = gosu.math.point.rotate(vector, bot.angle);

        moveAbsolute(movementVector);
    }

    function moveAbsolute(vector) {
        bot.translate(vector);

        var movementVector = gosu.math.createVector(vector.x, vector.y);
        var previousDirection = bot.direction;
        
        bot.direction = movementVector.add(previousDirection);
    }

    bot.fire = function () {

        if (bot.weapon.cooldownTimeLeft > 0) {
            return;
        }

        raiseShotFiredEvent();

        bot.weapon.cooldownTimeLeft = bot.weapon.cooldownTime;
    };

    bot.onShotFired = function (callback) {
        shotFiredCallbacks.push(callback);
    }

    bot.onKilled = function (callback) {
        killedCallbacks.push(callback);
    }

    bot.onHitByBullet = function (callback) {
        hitByBulletCallbacks.push(callback);
    }

    bot.onCollision = function (callback) {
        collisionCallbacks.push(callback);
    }

    bot.createStatus = function (simplified) {

        var seenBots = null;

        // Since seenBots calls createStatus for the other bots
        // this is an endless loop waiting to happen if two bots see
        // each other at the same time. 
        if (!simplified) {
            seenBots = collisionDetector.seenBots(bot).map(function (bot) {
                // Use simplified status to avoid endless loop
                return bot.createStatus(true);
            });
        }

        return {
            id: bot.id,
            teamId: bot.teamId,
            position: {
                x: bot.x,
                y: bot.y,
                width: bot.width,
                height: bot.height,
                isAtSouthWall: gosuArena.arenaHeight - bot.bottom() < 1,
                isAtNorthWall: bot.top() < 1,
                isAtWestWall: bot.left() < 1,
                isAtEastWall: gosuArena.arenaWidth - bot.right() < 1
            },
            arena: {
                width: gosuArena.arenaWidth,
                height: gosuArena.arenaHeight
            },
            angle: bot.angle,
            direction: bot.direction,
            health: bot.health,
            actionsPerRound: bot.actionsPerRound,
            roundsUntilWeaponIsReady: bot.weapon.cooldownTimeLeft,
            canFire: function () {
                return bot.weapon.cooldownTimeLeft <= 0
            },
            seenBots: seenBots,
            canMoveForward: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveForward)
            },
            canMoveBack: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveBack)
            },
            canMoveNorth: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveNorth)
            },
            canMoveSouth: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveSouth)
            },
            canMoveEast: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveEast)
            },
            canMoveWest: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveWest)
            },
            canMoveLeft: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveLeft)
            },
            canMoveRight: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveRight)
            },
            canTurnLeft: function () {
                return collisionDetector.canPerformMoveAction(bot, function () {
                    bot.turn(-1);
                })
            },
            canTurnRight: function () {
                return collisionDetector.canPerformMoveAction(bot, function () {
                    bot.turn(1);
                });
            }
        };
    }

    bot.tick = function() {
        // Reset the direction so that the bot direction will be
        // determined by the actions during this tick rather than remembering
        // a previous direction if this tick turns out to be one where
        // the bot is standing still
        bot.direction = { x: 0, y: 0 };
        
        if (bot.weapon.cooldownTimeLeft > 0) {
            bot.weapon.cooldownTimeLeft--;
        }

        var status = bot.createStatus();

        tickCallback(userActionQueue, status);

        for (var i = 0; i < options.actionsPerRound; i++) {
            actionQueue.performNext(bot);
        }
    }

    bot.teleportToRandomLocation = function () {
        bot.x = Math.random() * (gosuArena.arenaWidth - bot.width);
        bot.y = Math.random() * (gosuArena.arenaHeight - bot.height);
    };

    var rectangleCache = gosuArena.rectangleCache.create(bot);
    var sightRectangleCache = gosuArena.rectangleCache.create(bot);

    bot.rectangle = function() {
        if (!rectangleCache.isValidFor(bot)) {
            rectangleCache.addEntry(bot, bot.calculateRectangle());
        }

        return rectangleCache.getEntry(bot);
    };

    bot.sightRectangle = function () {

        if (!sightRectangleCache.isValidFor(bot)) {
            sightRectangleCache.addEntry(bot, calculateSightRectangle());
        }

        return sightRectangleCache.getEntry(bot);
    }

    function calculateSightRectangle() {

        // Get the rectangle without rotation first
        // and then rotate it, since that is the easiest
        // way to think about the rectangle coordinates
        var muzzlePosition = gosu.math.point.translate(
            bot.center(),
            bot.weapon.botRelativeMuzzlePosition()
        );
        
        var sightArea = gosu.math.rectangle.createFromPoints({
            x1: muzzlePosition.x - bot.sight.width / 2,
            y1: muzzlePosition.y,
            x2: muzzlePosition.x + bot.sight.width / 2,
            y2: muzzlePosition.y + bot.sight.length
        });

        return sightArea.rotate(bot.angle, bot.center());
    };

    function raiseKilledEvent() {
        killedCallbacks.forEach(function(callback) {
            callback(bot);
        });
    }

    function raiseShotFiredEvent() {
        shotFiredCallbacks.forEach(function (callback) {
            callback(bot);
        });
    }

    function raiseHitByBulletEvent(bullet) {

        var status = bot.createStatus();
        var eventArgs = {
            angle: gosu.math.normalizeAngleInDegrees(bullet.angle - 180)
        };

        hitByBulletCallbacks.forEach(function (callback) {
            callback(userActionQueue, status, eventArgs);
        });
    }

    function raiseCollidedEvent(bullet) {

        var status = bot.createStatus();

        collisionCallbacks.forEach(function (callback) {
            callback(userActionQueue, status);
        });
    }

    
    bot.hitBy = function (bullet) {
        bot.health -= bullet.damage;

        raiseHitByBulletEvent(bullet);

        if (!bot.isAlive()) {
            raiseKilledEvent();
        }
    };

    bot.collided = function () {
        raiseCollidedEvent();  
    };

    gosu.snapshot.extend(bot);

    bot.snapshotPosition = function () {
        bot.snapshot("x", "y", "angle");
    };

    return bot;
};
