///<reference path="~/Scripts/_references.js" />

describe("math", function () {
    describe("point", function () {
        describe("rotate", function () {
            it("Origin (0, 0) is unchanged by rotation", function () {
                expect(gosu.math.point.rotate({
                    x: 0,
                    y: 0
                }, 45)).toEqualPoint({
                    x: 0,
                    y: 0
                });
            });

            it("Rotating (1, 0) 90 degrees yields (0, 1)", function () {
                expect(gosu.math.point.rotate({
                    x: 1,
                    y: 0
                }, 90)).toEqualPoint({
                    x: 0,
                    y: 1
                });
            });

            it("Rotating (2, 2) 45 degrees around (1, 1) yields (1, 1+sqrt(2))", function () {
                expect(gosu.math.point.rotate({ x: 2, y: 2 }, 45, { x: 1, y: 1 }))
                    .toEqualPoint({ x: 1, y: 1 + Math.sqrt(2) });
            });
        })
    })
});
