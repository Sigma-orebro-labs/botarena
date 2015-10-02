var gosu = gosu || {};
gosu.math = gosu.math || {};

(function () {
    gosu.math.createVector = function(x, y) {
        function length () {
            return Math.sqrt(x * x + y * y);
        };

        function scalarProduct (other) {
            return x * other.x + y * other.y;
        };

        function angleTo (other) {
            var dotProduct = scalarProduct(other);
            var cosAngle = dotProduct / length() / other.length();

            var angleInRadians = Math.acos(cosAngle);
            return angleInRadians / (2 * Math.PI) * 360;
        };

        function signedAngleTo(other) {
            var perpendicularDotProduct = x * other.y - y * other.x;

            var angleInRadians = Math.atan2(
                perpendicularDotProduct,
                other.scalarProduct(gosu.math.createVector(x, y)));

            return gosu.math.radiansToDegrees(angleInRadians);
        }
        
        function divide(factor) {
            return gosu.math.createVector(x / factor, y / factor);
        };

        function multiply(factor) {
            return gosu.math.createVector(x * factor, y * factor);
        };

        function add(other) {
            return gosu.math.createVector(
                x + other.x,
                y + other.y
            );
        }

        function subtract(other) {
            return gosu.math.createVector(
                x - other.x,
                y - other.y
            );
        }
        
        function normalize() {
            return divide(length());
        };
        
        return {
            x: x,
            y: y,
            normalize: normalize,
            length: length,
            scalarProduct: scalarProduct,
            angleTo: angleTo,
            signedAngleTo: signedAngleTo,
            divide: divide,
            multiply: multiply,
            add: add,
            subtract: subtract
        };
    };
})();
