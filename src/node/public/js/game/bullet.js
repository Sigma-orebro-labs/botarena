var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};

gosuArena.factories.createBullet = function (bot) {

    var botMuzzlePosition = bot.weapon.muzzlePosition();

    var width = 3;
    var height = 6;

    var properties = {
        x: botMuzzlePosition.x - width / 2,
        y: botMuzzlePosition.y - height / 2,
        width: width,
        height: height,
        color: "#f00",
        angle: bot.angle,
        firedBy: bot,
        damage: bot.weapon.damage
    };

    var bullet = gosuArena.worldObject.create(properties);
    
    bullet.tick = function () {
        var movementVector = gosu.math.point.rotate({ x: 0, y: 12 }, bullet.angle);
        bullet.translate(movementVector);
    };

    return bullet;
};
