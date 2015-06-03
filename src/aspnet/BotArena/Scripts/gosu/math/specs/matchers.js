beforeEach(function () {

    function toEqualPoint (expectedPoint) {
        var actualPoint = this.actual;
        return gosu.math.areWithinDelta(actualPoint.x, expectedPoint.x, 0.00001) &&
            gosu.math.areWithinDelta(actualPoint.y, expectedPoint.y, 0.00001);
    }

    this.addMatchers({
        toBeCloseTo: function(expectedValue) {
            var actualValue = this.actual;
            return gosu.math.areWithinDelta(actualValue, expectedValue, 0.00001);
        },
        toEqualPoint: toEqualPoint,
        toEqualVector: toEqualPoint,        
        toEqualLineSegment: function (expectedLineSegment) {
            var actualLineSegment = this.actual;
            return gosu.math.areWithinDelta(expectedLineSegment.x1, actualLineSegment.x1) &&
                gosu.math.areWithinDelta(expectedLineSegment.x2, actualLineSegment.x2) &&
                gosu.math.areWithinDelta(expectedLineSegment.y1, actualLineSegment.y1) &&
                gosu.math.areWithinDelta(expectedLineSegment.y2, actualLineSegment.y2);
        },
        toBeInInterval: function (expectedMin, expectedMax) {
            return this.actual >= expectedMin && this.actual <= expectedMax;
        }
    });
})
