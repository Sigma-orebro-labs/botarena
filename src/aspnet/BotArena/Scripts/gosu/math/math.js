var gosu = gosu || {};
gosu.math = gosu.math || {};

gosu.math.areWithinDelta = function(a, b, delta) {
    delta = delta || 0.0000001;
    return Math.abs(a - b) <= delta;
};

gosu.math.mean = function (a, b) {
    return a + b / 2.0;
};

gosu.math.radiansToDegrees = function (radians) {
    return (radians / (2 * Math.PI) * 360) % 360;
};

gosu.math.degreesToRadians = function (degrees) {
    return (degrees / 360.0 * 2 * Math.PI) % (2 * Math.PI);
};

gosu.math.normalizeAngleInDegrees = function (degrees) {
    var angle = degrees % 360;

    if (angle < 0) {
        angle += 360;
    }

    return angle;
};

gosu.math.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};
