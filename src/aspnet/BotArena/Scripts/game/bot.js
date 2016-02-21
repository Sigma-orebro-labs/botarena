var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createBot = function (tickCallback, options, collisionDetector) {

    var shotFiredCallbacks = [];
    var killedCallbacks = [];
    var collisionCallbacks = [];
    var hitByBulletCallbacks = [];
    var healthChangedCallbacks = [];
    var augmentationActivatedCallbacks = [];
    var augmentationDeactivatedCallbacks = [];

    var staticModifiers = options.staticModifiers;

    var currentRoundDirection = { x: 0, y: 0 };

    function calculateWeaponCooldown() {
        var cooldown = options.weaponCooldownTime * staticModifiers.calculateWeaponCooldownTimeFactor();

        if (cooldown < options.minimalAllowedWeaponCooldown) {
            return options.minimalAllowedWeaponCooldown;
        }

        return cooldown;
    }

    var weapon = {
        width: options.weaponWidth,
        height: options.weaponHeight,
        cooldownTime: calculateWeaponCooldown(),
        cooldownTimeLeft: 0,
        baseDamage: options.weaponDamage,
        offsetDistanceFromCenter: options.weaponOffsetDistanceFromCenter,
        angleOffset: 0
};

    weapon.calculateDamage = function() {
        return weapon.baseDamage * staticModifiers.calculateWeaponDamageFactor();
    };
    var initialHealthPoints = options.initialHealthPoints * staticModifiers.calculateHealthPointFactor();

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
        isVisible: true,
        name: options.name,
        actionsPerRound: options.actionsPerRound,
        maxHealth: initialHealthPoints,
        health: initialHealthPoints,
        previousRoundDirection: { x: 0, y: 0},
        movementSpeed: options.initialMovementSpeed * staticModifiers.calculateMovementSpeedFactor(),
        damageReductionFactor: options.initialDamageReductionFactor * staticModifiers.calculateDamageReductionFactor(),
        rotationSpeedInDegrees: options.rotationSpeedInDegrees * staticModifiers.canculateRotationSpeedFactor(),
        weapon: weapon,
        sight: {
            width: options.sightWidth,
            length: options.sightLength
        }
    };

    function setHealth(value) {
        properties.health = value;
        raiseHealthChanged();
    }

    function raiseAugmentationActivated(augmentation) {
        augmentationActivatedCallbacks.forEach(function (callback) {
            callback(augmentation);
        });
    }

    function raiseAugmentationDeactivated(augmentation) {
        augmentationDeactivatedCallbacks.forEach(function (callback) {
            callback(augmentation);
        });
    }

    var augmentationExposedMethods = {
        setHealth: setHealth,
        raiseAugmentationActivated: raiseAugmentationActivated,
        raiseAugmentationDeactivated: raiseAugmentationDeactivated
    };

    var bot = gosuArena.worldObject.create(properties);

    function executeUnsafeCode(codeBlock) {
        try {
            codeBlock();
        } catch (error) {
            gosuArena.events.raiseBotScriptError({
                bot: bot,
                exception: error
            });

            if (options.rethrowScriptErrors) {
                throw error;
            }
        }
    }

    var actionQueue = gosuArena.factories.createActionQueue(collisionDetector, bot);
    var userActionQueue = gosuArena.factories.createUserActionQueue(actionQueue);

    var augmentations = gosuArena.factories.augmentations.createAugmentationCollection(options.augmentations, properties, augmentationExposedMethods);

    bot.augmentations = function() {
        return augmentations;
    };

    bot.isVisible = function() {
        return properties.isVisible;
    };

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
        return properties.health > 0;
    }

    bot.health = function() {
        return properties.health;
    }

    bot.healthPercentage = function () {
        return properties.health / properties.maxHealth;
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
        bot.translate({ x: vector.x * bot.movementSpeed, y: vector.y * bot.movementSpeed });

        var movementVector = gosu.math.createVector(vector.x, vector.y);
        var previousDirection = currentRoundDirection;
        
        currentRoundDirection = movementVector.add(previousDirection);
    }

    bot.fire = function (angle) {
        if (bot.weapon.cooldownTimeLeft > 0) {
            return;
        }

        bot.weapon.angleOffset = gosu.math.clamp(angle || 0, -20, 20);

        raiseShotFiredEvent();

        bot.weapon.cooldownTimeLeft = bot.weapon.cooldownTime;
    };

    bot.onShotFired = function (callback) {
        shotFiredCallbacks.push(callback);
    }

    bot.onKilled = function (callback) {
        killedCallbacks.push(callback);
    }

    bot.onHealthChanged = function(callback) {
        healthChangedCallbacks.push(callback);
    }

    bot.onHitByBullet = function (callback) {
        hitByBulletCallbacks.push(callback);
    }

    bot.onCollision = function (callback) {
        collisionCallbacks.push(callback);
    }

    bot.onAugmentationActivated = function(callback) {
        augmentationActivatedCallbacks.push(callback);
    };

    bot.onAugmentationDeactivated = function (callback) {
        augmentationDeactivatedCallbacks.push(callback);
    };

    function createBotStatusesForSeenBots(seenBots, enemiesArray, alliesArray) {
        for (var j = 0; j < seenBots.length; j++) {
            var seenBot = seenBots[j];

            if (!seenBot.isVisible()) {
                continue;
            }

            var botStatusForSeenBot = seenBot.createStatus(true);

            if (bot.teamId && botStatusForSeenBot.teamId == bot.teamId) {
                alliesArray.push(botStatusForSeenBot);
            } else {
                enemiesArray.push(botStatusForSeenBot);
            }
        }
    }

    bot.createStatus = function (simplified) {

        var enemiesOnTarget = null;
        var alliesOnTarget = null;

        var enemiesInFieldOfVision = null;
        var alliesInFieldOfVision = null;

        // Since seenBots calls createStatus for the other bots
        // this is an endless loop waiting to happen if two bots see
        // each other at the same time.
        // We also don't want to let one bot know which bots 
        // another bot can see. That would be a bit too much info to give away.
        if (!simplified) {

            enemiesOnTarget = [];
            alliesOnTarget = [];

            enemiesInFieldOfVision = [];
            alliesInFieldOfVision = [];

            var seenBots = collisionDetector.seenBots(bot);
            var botsInFieldOfVision = collisionDetector.botsInFieldOfView(bot);

            createBotStatusesForSeenBots(seenBots, enemiesOnTarget, alliesOnTarget);
            createBotStatusesForSeenBots(botsInFieldOfVision, enemiesInFieldOfVision, alliesInFieldOfVision);
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
            previousRoundDirection: bot.previousRoundDirection,
            maxHealth: bot.maxHealth,
            health: properties.health,
            movementSpeed: bot.movementSpeed,
            isVisible: bot.isVisible(),
            actionsPerRound: bot.actionsPerRound,
            roundsUntilWeaponIsReady: bot.weapon.cooldownTimeLeft,
            canFire: function () {
                return bot.weapon.cooldownTimeLeft <= 0;
            },
            enemiesOnTarget: enemiesOnTarget,
            alliesOnTarget: alliesOnTarget,
            enemiesInFieldOfVision: enemiesInFieldOfVision,
            alliesInFieldOfVision: alliesInFieldOfVision,
            canMoveForward: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveForward);
            },
            canMoveBack: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveBack);
            },
            canMoveNorth: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveNorth);
            },
            canMoveSouth: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveSouth);
            },
            canMoveEast: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveEast);
            },
            canMoveWest: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveWest);
            },
            canMoveLeft: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveLeft);
            },
            canMoveRight: function () {
                return collisionDetector.canPerformMoveAction(bot, bot.moveRight);
            },
            canTurnLeft: function () {
                return collisionDetector.canPerformMoveAction(bot, function() {
                    bot.turn(-1);
                });
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
        bot.previousRoundDirection = currentRoundDirection;
        currentRoundDirection = { x: 0, y: 0 };
        
        if (bot.weapon.cooldownTimeLeft > 0) {
            bot.weapon.cooldownTimeLeft--;
        }

        var status = bot.createStatus();

        executeUnsafeCode(function() {
            tickCallback(userActionQueue, status, augmentations);
        });

        for (var i = 0; i < options.actionsPerRound; i++) {
            actionQueue.performNext(bot);
        }

        for (var augmentationName in augmentations) {
            augmentations[augmentationName].tick();
        }
    }

    bot.teleportToRandomLocation = function () {
        bot.x = Math.random() * (gosuArena.arenaWidth - bot.width);
        bot.y = Math.random() * (gosuArena.arenaHeight - bot.height);
    };

    var rectangleCache = gosuArena.rectangleCache.create(bot);
    var sightRectangleCache = gosuArena.rectangleCache.create(bot);
    var fieldOfVisionRectangleCache = gosuArena.rectangleCache.create(bot);

    bot.fieldOfVisionRectangle = function () {

        if (!fieldOfVisionRectangleCache.isValidFor(bot)) {
            fieldOfVisionRectangleCache.addEntry(bot, calculateFieldOfVisionRectangle());
        }

        return fieldOfVisionRectangleCache.getEntry(bot);
    }

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

    function calculateFieldOfVisionRectangle() {
        var botCenter = bot.center();
        var rectangle = gosu.math.rectangle.create(botCenter, 2000, 2000);
        var rotatedRectangle = rectangle.rotate(bot.angle + 45, botCenter);
        return rotatedRectangle;
    };

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
            executeUnsafeCode(function() {
                callback(userActionQueue, status, augmentations, eventArgs);
            });
        });
    }

    function raiseCollidedEvent(bullet) {

        var status = bot.createStatus();

        collisionCallbacks.forEach(function (callback) {
            executeUnsafeCode(function() {
                callback(userActionQueue, status, augmentations);
            });
        });
    }

    function raiseHealthChanged() {
        var status = bot.createStatus();

        healthChangedCallbacks.forEach(function(callback) {
            callback(status);
        });
    }

    bot.hitBy = function (bullet) {
        properties.health -= bullet.damage / bot.damageReductionFactor;

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

    bot.cleanUp = function() {
        // Remove all event listeners to avoid ghost events
        shotFiredCallbacks.length = 0;
        killedCallbacks.length = 0;
        collisionCallbacks.length = 0;
        hitByBulletCallbacks.length = 0;
        healthChangedCallbacks.length = 0;
        augmentationActivatedCallbacks.length = 0;
        augmentationDeactivatedCallbacks.length = 0;
    };

    bot.commandNames = function() {
        var names = [];

        for (var prop in bot.commands) {
            if (bot.commands.hasOwnProperty(prop)) {
                names.push(prop);
            }
        }

        return names;
    };

    bot.class = options.botClass;

    return bot;
};