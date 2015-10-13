var gosuArena = gosuArena || {};
gosuArena.specs = gosuArena.specs || {};
gosuArena.specs.matchers = gosuArena.specs.matchers || {};

(function() {

    gosuArena.specs.matchers.toBeGoofy = function () {
        return {
            compare: function (actualValue, expectedValue) {
                var result = {};

                result.pass = gosu.math.areWithinDelta(actualValue, expectedValue, 0.00001);

                return result;
            }
        };
    };

    function toEqualPoint(actualPoint, expectedPoint) {

        var result = {};

        result.pass = gosu.math.areWithinDelta(actualPoint.x, expectedPoint.x, 0.00001) &&
            gosu.math.areWithinDelta(actualPoint.y, expectedPoint.y, 0.00001);

        return result;
    }

    gosuArena.specs.matchers.toBeCloseTo = function () {
        return {
            compare: function (actualValue, expectedValue) {

                var result = {};

                result.pass = gosu.math.areWithinDelta(actualValue, expectedValue, 0.00001);

                return result;
            }
        };
    };

    gosuArena.specs.matchers.toEqualPoint = function() {
        return {
            compare: toEqualPoint
        }
    };

    gosuArena.specs.matchers.toEqualVector = function () {
        return {
            compare: toEqualPoint
        }
    };

    gosuArena.specs.matchers.toEqualLineSegment = function() {
        return {
            compare: function(actualLineSegment, expectedLineSegment) {
                var result = {};

                result.pass = gosu.math.areWithinDelta(expectedLineSegment.x1, actualLineSegment.x1) &&
                    gosu.math.areWithinDelta(expectedLineSegment.x2, actualLineSegment.x2) &&
                    gosu.math.areWithinDelta(expectedLineSegment.y1, actualLineSegment.y1) &&
                    gosu.math.areWithinDelta(expectedLineSegment.y2, actualLineSegment.y2);

                return result;
            }
        };
    };

    gosuArena.specs.matchers.toBeInInterval = function() {
        return {
            compare: function(actual, expectedMin, expectedMax) {
                return {
                     result: actual >= expectedMin && actual <= expectedMax
                };
            }
        }
    };

})();
