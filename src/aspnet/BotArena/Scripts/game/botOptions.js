var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createSafeBotOptions = function (userOptions, isTraining) {

    var teamColors = ['#f00', '#0f0', '#00f', '#f0f', '#ff0', '#0ff', '#990', '#909', '#099'];
    
    var width = 25;
    var height = 25;
    var weaponCooldownTime = 25;
    var minimalAllowedWeaponCooldown = 9;
    var weaponWidth = width * 0.2;
    var weaponLength = 0; // Cannon is no further forward than top edge of bot
    var weaponDamage = 10;
    var weaponOffsetDistanceFromCenter = 0;
    var initialHealthPoints = 100;
    var sightWidth = 1;
    var sightLength = 1000;
    var actionsPerRound = 2;
    var movementSpeed = 1;
    var initialDamageReductionFactor = 1;
    var rotationSpeedInDegrees = 1;

    function isValidColor(value) {
        return value && /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value);
    }

    function isValidX(value) {
        return value >= 0 && value <= gosuArena.arenaWidth - width;
    }

    function isValidY(value) {
        return value >= 0 && value <= gosuArena.arenaHeight - height;
    }


    userOptions = userOptions || {};
    userOptions.startPosition = userOptions.startPosition || {};
    userOptions.equipment = userOptions.equipment || [];
    userOptions.augmentations = userOptions.augmentations || [];

    var x = Math.random() * (gosuArena.arenaWidth - width);
    var y = Math.random() * (gosuArena.arenaHeight - height);

    var angle = 0;

    if (isTraining) {
        if (isValidX(userOptions.startPosition.x)) {
            x = userOptions.startPosition.x;
        }

        if (isValidY(userOptions.startPosition.y)) {
            y = userOptions.startPosition.y;
        }

        angle = userOptions.startPosition.angle || angle;
    }

    var color = isValidColor(userOptions.color) ? userOptions.color : "#cecece";

    if (userOptions.teamId) {
        color = teamColors[userOptions.teamId % teamColors.length];
    }

    var classModifier = gosuArena.factories.modifiers.create(userOptions.botClass);

    var equipmentModifiers = userOptions.equipment.map(function (equipmentName) {
        return gosuArena.factories.modifiers.create(equipmentName);
    });

    var allModifiers = [classModifier].concat(equipmentModifiers);

    var staticModifiers = gosuArena.factories.modifiers.createModifierCollection(allModifiers);

    var augmentations = userOptions.augmentations.map(function(name) {
        return gosuArena.factories.augmentations.createDescriptor(name);
    }); 

    return {
        id: userOptions.id,
        uniqueId: userOptions.uniqueId,
        teamId: userOptions.teamId,
        name: userOptions.name,
        width: width,
        height: height,
        actionsPerRound: actionsPerRound,
        x: x,
        y: y,
        angle: angle,
        color: color,
        weaponCooldownTime: weaponCooldownTime,
        minimalAllowedWeaponCooldown: minimalAllowedWeaponCooldown,
        weaponWidth: weaponWidth,
        weaponHeight: weaponLength,
        weaponDamage: weaponDamage,
        weaponOffsetDistanceFromCenter: weaponOffsetDistanceFromCenter,
        sightWidth: sightWidth,
        sightLength: sightLength,
        initialHealthPoints: initialHealthPoints,
        initialMovementSpeed: movementSpeed,
        initialDamageReductionFactor: initialDamageReductionFactor,
        rotationSpeedInDegrees: rotationSpeedInDegrees,
        botClass: userOptions.botClass,
        staticModifiers: staticModifiers,
        augmentations: augmentations,
        rethrowScriptErrors: userOptions.rethrowScriptErrors
    };
};
