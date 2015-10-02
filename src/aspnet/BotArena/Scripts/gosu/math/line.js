var gosu = gosu || {};
gosu.math = gosu.math || {};
gosu.math.line = gosu.math.line || {};

gosu.math.line.areEqual = function (line1, line2) {
    return gosu.math.areWithinDelta(line1.x1, line2.x1) &&
           gosu.math.areWithinDelta(line1.y1, line2.y1) &&
           gosu.math.areWithinDelta(line1.x2, line2.x2) &&
           gosu.math.areWithinDelta(line1.y2, line2.y2);
}

gosu.math.getRayDefinition = function (lineSegment) {
    var k = Math.abs(lineSegment.y1- lineSegment.y2) /
        Math.abs(lineSegment.x1 - lineSegment.x2);

    // y = k*x + m
    // m = y - k*x
    var m = lineSegment.y1 - k * lineSegment.x1;

    return { k: k, m: m };
};

// Credit: http://jsfiddle.net/justin_c_rounds/Gd2S2/
gosu.math.getLineSegmentIntersection = function(line1, line2) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2.y2 - line2.y1) * (line1.x2 - line1.x1)) - ((line2.x2 - line2.x1) * (line1.y2 - line1.y1));
    if (denominator == 0) {
        return result;
    }
    a = line1.y1 - line2.y1;
    b = line1.x1 - line2.x1;
    numerator1 = ((line2.x2 - line2.x1) * a) - ((line2.y2 - line2.y1) * b);
    numerator2 = ((line1.x2 - line1.x1) * a) - ((line1.y2 - line1.y1) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1.x1 + (a * (line1.x2 - line1.x1));
    result.y = line1.y1 + (a * (line1.y2 - line1.y1));
    /*
    // it is worth noting that this should be the same as:
    x = line2.x1 + (b * (line2.x2 - line2.x1));
    y = line2.x1 + (b * (line2.y2 - line2.y1));
    */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};

// Credit: http://stackoverflow.com/questions/328107/how-can-you-determine-a-point-is-between-two-other-points-on-a-line-segment
gosu.math.isPointOnLine = function(point, line) {
    var crossProduct = (point.y - line.y1) * (line.x2 - line.x1) -
        (point.x - line.x1) * (line.y2 - line.y1)
    
    var epsilon = 0.000001;

    if (Math.abs(crossProduct) > epsilon) {
        return false;
    }

    var dotProduct = (point.x - line.x1) * (line.x2 - line.x1) + (point.y - line.y1)*(line.y2 - line.y1)

    if (dotProduct < 0) {
        return false;
    }

    var squaredLineLength = (line.x2 - line.x1)*(line.x2 - line.x1) + (line.y2 - line.y1)*(line.y2 - line.y1);

    if (dotProduct > squaredLineLength) {
        return false;
    }

    return true;
}

gosu.math.areLineSegmentsOverlapping = function (line1, line2) {

    if (gosu.math.line.areEqual(line1, line2)) {
        return true;
    }

    var rayDefinition1 = gosu.math.getRayDefinition(line1);
    var rayDefinition2 = gosu.math.getRayDefinition(line2);

    if (rayDefinition1.k !== rayDefinition2.k ||
        rayDefinition1.m !== rayDefinition2.m) {
        return false;
    }

    // Check line1MinX > line2MinX && line1MinX < line2MaxX instead

    var line1MinX = Math.min(line1.x1, line1.x2);
    var line1MaxX = Math.max(line1.x1, line1.x2);
    var line2MinX = Math.min(line2.x1, line2.x2);
    var line2MaxX = Math.max(line2.x1, line2.x2);

    return line1MinX > line2MinX && line1MinX < line2MaxX ||
        line2MinX > line1MinX && line2MinX < line1MaxX ||
        line1MaxX > line2MinX && line1MaxX < line2MaxX ||
        line2MaxX > line1MinX && line2MaxX < line1MaxX;
}

gosu.math.areLineSegmentsIntersecting = function (line1, line2) {

    if (gosu.math.isPointOnLine({ x: line1.x1, y: line1.y1 }, line2) ||
        gosu.math.isPointOnLine({ x: line1.x2, y: line1.y2 }, line2) ||
        gosu.math.isPointOnLine({ x: line2.x1, y: line2.y1 }, line1) ||
        gosu.math.isPointOnLine({ x: line2.x2, y: line2.y2 }, line1)) {
            return true;
        }

    return gosu.math.areLineSegmentsInternallyIntersecting(line1, line2);
}

gosu.math.areLineSegmentsInternallyIntersecting = function (line1, line2) {

    if (gosu.math.areLineSegmentsOverlapping(line1, line2)) {
        return true;
    }
    
    var intersection = gosu.math.getLineSegmentIntersection(line1, line2);
    return intersection.onLine1 && intersection.onLine2;
}
