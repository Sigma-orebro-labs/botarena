describe("math", function () {
    describe("rectangle", function () {
        var rectangle1 = null;
        var rectangle2 = null;

        beforeEach(function () {
            this.addMatchers({
                hasCorner: function (expectedCorner) {
                    var actualRectangle = this.actual;
                    var matchingCorners = actualRectangle.corners.filter(function (corner) {
                        return gosu.math.areWithinDelta(corner.x, expectedCorner.x) &&
                            gosu.math.areWithinDelta(corner.y, expectedCorner.y);
                    });
                    return matchingCorners.length > 0;
                }
            });

            rectangle1 = gosu.math.rectangle.createFromPoints({
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 1
            });
            rectangle2 = gosu.math.rectangle.createFromPoints({
                x1: 0,
                y1: 0,
                x2: 4,
                y2: 2
            });
        });

        it("center is the middle point between all corners", function () {
            expect(rectangle2.center).toEqualPoint({
                x: 2,
                y: 1
            })
        });

        it("(9,9) to (10,10) rectangle has min x and y = 9, max x and y = 10", function () {
            var r = gosu.math.rectangle.createFromPoints({ x1: 9, y1: 9, x2: 10, y2: 10 });

            expect(r.minX).toEqual(9);
            expect(r.minY).toEqual(9);
            expect(r.maxX).toEqual(10);
            expect(r.maxY).toEqual(10);
        });

        it("created from (0,0) and (4,2) has corners (0,0),(4,0),(0,2) and (4,2)", function () {
            expect(rectangle2).hasCorner({ x: 0, y: 0});
            expect(rectangle2).hasCorner({ x: 0, y: 2});
            expect(rectangle2).hasCorner({ x: 4, y: 0});
            expect(rectangle2).hasCorner({ x: 4, y: 2});
        })

        it("corners are specified clockwise starting in start point", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });

            expect(r1.corners[0]).toEqualPoint({ x: 0, y: 0 });
            expect(r1.corners[1]).toEqualPoint({ x: 0, y: 1 });
            expect(r1.corners[2]).toEqualPoint({ x: 1, y: 1 });
            expect(r1.corners[3]).toEqualPoint({ x: 1, y: 0 });
        });

        it("edges are specified clockwise starting in start point", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });

            expect(r1.edges[0]).toEqualLineSegment({ x1: 0, y1: 0, x2: 0, y2: 1 });
            expect(r1.edges[1]).toEqualLineSegment({ x1: 0, y1: 1, x2: 1, y2: 1 });
            expect(r1.edges[2]).toEqualLineSegment({ x1: 1, y1: 1, x2: 1, y2: 0 });
            expect(r1.edges[3]).toEqualLineSegment({ x1: 1, y1: 0, x2: 0, y2: 0 });
        });

        it("does not overlap rectangle with left-most part to the right", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });
            var r2 = gosu.math.rectangle.createFromPoints({ x1: 2, y1: 0, x2: 3, y2: 1 });

            expect(r1.overlaps(r2)).toEqual(false);
        });

        it("does not overlap rectangle with upper-most part below", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });
            var r2 = gosu.math.rectangle.createFromPoints({ x1: 0.5, y1: -2, x2: 3, y2: -1 });

            expect(r1.overlaps(r2)).toEqual(false);
        });

        it("overlaps rectangle with single corner within rectangle", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });
            var r2 = gosu.math.rectangle.createFromPoints({ x1: 0.5, y1: 0.6, x2: 3, y2: -2 });

            expect(r1.overlaps(r2)).toEqual(true);
            expect(r2.overlaps(r1)).toEqual(true);
        });

        it("overlaps rectangle with same size on same y but with left edge inside rectangle", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });
            var r2 = gosu.math.rectangle.createFromPoints({ x1: 0.5, y1: 0, x2: 3, y2: 1 });

            expect(r1.overlaps(r2)).toEqual(true);
            expect(r2.overlaps(r1)).toEqual(true);
        });

        it("does not overlap rectangle with left edge on same x as other's right edge'", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });
            var r2 = gosu.math.rectangle.createFromPoints({ x1: 1, y1: -1, x2: 2, y2: 2 });

            expect(r1.overlaps(r2)).toEqual(false);
            expect(r2.overlaps(r1)).toEqual(false);
        });

        it("overlaps rectangle which is completely within it and hence has no intersections", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });
            var r2 = gosu.math.rectangle.createFromPoints({ x1: 0.5, y1: 0.5, x2: 0.6, y2: 0.6 });

            expect(r1.overlaps(r2)).toEqual(true);
            expect(r2.overlaps(r1)).toEqual(true);
        });

        it("overlaps rotated rectangle which would be completely above if not rotated", function () {
            var r1 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });
            var r2 = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 1.1, x2: 1, y2: 2.1 })
                .rotateAroundCenter(45);

            expect(r1.overlaps(r2)).toEqual(true);
            expect(r2.overlaps(r1)).toEqual(true);
        });

        it ("can be created from point, width and height", function () {
            var r = gosu.math.rectangle.create({ x: 1, y: 2 }, 3, 5);

            expect(r.center).toEqualPoint({ x: 2.5, y: 4.5 });
            expect(r).hasCorner({ x: 1, y: 2 });
            expect(r).hasCorner({ x: 1, y: 7 });
            expect(r).hasCorner({ x: 4, y: 2 });
            expect(r).hasCorner({ x: 4, y: 7 });
        });

        describe("rotation", function () {

            it("rectangle has same corners after rotating 90 degrees around center", function () {
                var r = gosu.math.rectangle.createFromPoints({ x1: 0, y1: 0, x2: 1, y2: 1 });

                var rotated = r.rotateAroundCenter(90);

                expect(rotated).hasCorner({ x: 0, y: 0 });
                expect(rotated).hasCorner({ x: 0, y: 1 });
                expect(rotated).hasCorner({ x: 1, y: 0 });
                expect(rotated).hasCorner({ x: 1, y: 1 });
            });


            it("centered in the origin, 45 degrees around center", function () {
                var r = gosu.math.rectangle.createFromPoints({ x1: -1, y1: -1, x2: 1, y2: 1 });

                var rotated = r.rotateAroundCenter(45);

                var sqrt2 = Math.sqrt(2);

                expect(rotated).hasCorner({ x: sqrt2, y: 0 });
                expect(rotated).hasCorner({ x: 0, y: sqrt2 });
                expect(rotated).hasCorner({ x: -sqrt2, y: 0 });
                expect(rotated).hasCorner({ x: 0, y: -sqrt2 });
            })

            it("rotated around the origin when rectangle center is (1, 1)", function () {
                var r = gosu.math.rectangle.createFromPoints({ x1: 1, y1: 0, x2: 3, y2: 1 }) ;

                var rotated = r.rotate(90);

                expect(rotated).hasCorner({ x: 0, y: 1 });
                expect(rotated).hasCorner({ x: 0, y: 3 });
                expect(rotated).hasCorner({ x: -1, y: 1 });
                expect(rotated).hasCorner({ x: -1, y: 3 });
            });


            it("rotating around center does not change the center point", function () {
                var r = gosu.math.rectangle.createFromPoints({ x1: 1, y1: 0, x2: 3, y2: 1 }) ;

                var rotated = r.rotateAroundCenter(123);

                expect(rotated.center).toEqualPoint({ x: 2, y: 0.5 });
            });
        });
    });
});
