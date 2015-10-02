describe("math", function () {
    describe("line", function () {
        describe("intersection", function () {
            it("line is considered to intersect itself", function () {
                var line = { x1: 0, y1: 0, x2: 1, y2: 1 };

                expect(gosu.math.areLineSegmentsIntersecting(line, line)).toEqual(true);
            });

            it("partially overlapping, parallel line segments are considered intersecting", function () {
                var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
                var line2 = { x1: 0.5, y1: 0, x2: 1.5, y2: 0 };

                expect(gosu.math.areLineSegmentsIntersecting(line1, line2)).toEqual(true);
            });

            it("partially overlapping, parallel line segments with common start point are considered intersecting", function () {
                var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
                var line2 = { x1: 0, y1: 0, x2: 0.5, y2: 0 };

                expect(gosu.math.areLineSegmentsIntersecting(line1, line2)).toEqual(true);
            });

            it("partially overlapping, parallel line segments with common end point are considered intersecting", function () {
                var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
                var line2 = { x1: 0.5, y1: 0, x2: 1, y2: 0 };

                expect(gosu.math.areLineSegmentsIntersecting(line1, line2)).toEqual(true);
            });

            it("orthogonal line segments with intersection in the middle intersect", function () {
                var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
                var line2 = { x1: 0.5, y1: 0.5, x2: 0.5, y2: -0.5 };

                expect(gosu.math.areLineSegmentsIntersecting(line1, line2)).toEqual(true);
            });

            it("orthogonal line segments with start point on other line are considered intersecting", function () {
                var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
                var line2 = { x1: 0.5, y1: 0, x2: 0.5, y2: -0.5 };

                expect(gosu.math.areLineSegmentsIntersecting(line1, line2)).toEqual(true);
            });

            it("orthogonal line segments with end point on other line are considered intersecting", function () {
                var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
                var line2 = { x1: 0.5, y1: 1, x2: 0.5, y2: 0 };

                expect(gosu.math.areLineSegmentsIntersecting(line1, line2))
                    .toEqual(true);
            });

            it("orthogonal line segments with start point on other line are NOT considered internally intersecting", function () {
                var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
                var line2 = { x1: 0.5, y1: 0, x2: 0.5, y2: -0.5 };

                expect(gosu.math.areLineSegmentsInternallyIntersecting(line1, line2))
                    .toEqual(false);
            });

            it("orthogonal line segments with end point on other line are NOT considered internally intersecting", function () {
                var line1 = { x1: 0, y1: 0, x2: 1, y2: 0 };
                var line2 = { x1: 0.5, y1: 1, x2: 0.5, y2: 0 };

                expect(gosu.math.areLineSegmentsInternallyIntersecting(line1, line2))
                    .toEqual(false);
            });
        });

        describe("ray", function () {
            it("line segment from (0,0) to (1, 1) has ray definition k: 1, m: 0", function () {
                var rayDefinition = gosu.math.getRayDefinition({ x1: 0, y1: 0, x2: 1, y2: 1 });
                expect(rayDefinition.k).toEqual(1);
                expect(rayDefinition.m).toEqual(0);
            });

            it("line segment from (1, 2.1) to (2.5, 5.1) has ray definition k: 2, m: 0.6", function () {
                var rayDefinition = gosu.math.getRayDefinition({ x1: 1, y1: 2.1, x2: 2.5, y2: 5.1 });
                expect(rayDefinition.k).toBeCloseTo(2);
                expect(rayDefinition.m).toBeCloseTo(0.1);
            });

            it("line segment from (1, 3) to (-1, -5) has ray definition k: 4, m: -1", function () {
                var rayDefinition = gosu.math.getRayDefinition({ x1: 1, y1: 3, x2: -1, y2: -5 });
                expect(rayDefinition.k).toBeCloseTo(4);
                expect(rayDefinition.m).toBeCloseTo(-1);
            });
        });
    });
});
