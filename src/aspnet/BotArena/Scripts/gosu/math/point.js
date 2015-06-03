var gosu = gosu || {};
gosu.math = gosu.math || {};
gosu.math.point = gosu.math.point || {};

gosu.math.point.rotate = function (point, degrees, rotationCenter) {

    rotationCenter = rotationCenter || { x: 0, y: 0 };

    var radians = gosu.math.degreesToRadians(degrees);

    var translatedPoint = gosu.math.point.translate(
        point,
        gosu.math.point.negate(rotationCenter));

    var rotatedPoint = {
        x: Math.cos(radians) * translatedPoint.x - Math.sin(radians) * translatedPoint.y,
        y: Math.sin(radians) * translatedPoint.x + Math.cos(radians) * translatedPoint.y
    };

    return gosu.math.point.translate(rotatedPoint, rotationCenter);
};

gosu.math.point.translate = function (point, vector) {
    return { x: point.x + vector.x, y: point.y + vector.y };
};

gosu.math.point.negate = function (point) {
    return { x: -point.x, y: -point.y };
};

gosu.math.point.subtract = function (point1, point2) {
    return { x: point1.x - point2.x, y: point1.y - point2.y };
}

gosu.math.point.add = function (point1, point2) {
    return { x: point1.x + point2.x, y: point1.y + point2.y };
}


// Credit: http://stackoverflow.com/questions/2752725/finding-whether-a-point-lies-inside-a-rectangle-or-not
// This requires the edges to be defined in a clockwise direction
gosu.math.isPointInsideEdges = function (point, edges) {
    var edgesWithPointToRight = edges.filter(function (edge) {

        var a = -(edge.y2 - edge.y1);
        var b = edge.x2 - edge.x1;
        var c = -(a * edge.x1 + b * edge.y1);
        var d = a * point.x + b * point.y + c;

        return d < 0;
    });

    return edgesWithPointToRight.length == 4;
}
