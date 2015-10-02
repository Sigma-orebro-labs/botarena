///<reference path="~/Scripts/_references.js" />

describe("math", function () {
    describe("vector", function () {
        var vector1, vector2;

        beforeEach(function () {
            this.addMatchers({
                toBeCloseTo: function(expectedValue) {
                    var actualValue = this.actual;
                    return Math.abs(expectedValue - actualValue) < 0.00001;
                }
            });

            vector0 = gosu.math.createVector(0, 0)
            vector1 = gosu.math.createVector(1, 0);
            vector2 = gosu.math.createVector(0, 1);
            vector3 = gosu.math.createVector(2, 2);
        });

        it("is initialized with given coordinates", function () {
            expect(vector1.x).toEqual(1);
            expect(vector1.y).toEqual(0);

            expect(vector2.x).toEqual(0);
            expect(vector2.y).toEqual(1);
        });

        describe("length", function () {
            it("is zero for vector ending in (0,0)", function () {
                expect(vector0.length()).toEqual(0);
            });

            it("is 1 for vector ending in (1,0)", function () {
                expect(vector1.length()).toEqual(1);
            });

            it("is sqrt(8) for vector ending in (2,2)", function () {
                expect(vector3.length()).toEqual(Math.sqrt(8));
            });
        });

        describe("scalar product", function () {
            it("is 0 for (0,0) and (0,0)", function () {
                expect(vector0.scalarProduct(vector0)).toEqual(0);
            })

            it("is 2 for (1,0) and (2,2)", function () {
                expect(vector1.scalarProduct(vector3)).toEqual(2);
            })

            it("is 8 for (2,2) and (2,2)", function () {
                expect(vector3.scalarProduct(vector3)).toEqual(8);
            })
        });

        describe("angle", function () {

            it("has no angle to itself", function () {
                expect(vector1.angleTo(vector1)).toEqual(0);
            });

            it("is 1 for vector ending in (1,0)", function () {
                expect(vector1.length()).toEqual(1);
            });

            it("is 90 degrees to orthogonal vector", function () {
                expect(vector1.angleTo(vector2)).toEqual(90);
            });

            it("is 180 degrees to vector pointing in the opposite direction", function () {
                expect(vector3.angleTo(gosu.math.createVector(-2, -2))).toBeCloseTo(180);
            });
        });

        describe("signed angle", function () {
            it("is zero between vector and itself", function () {
                expect(vector1.signedAngleTo(vector1)).toEqual(0);
            });

            it("is 45 between x axis and (1,1)", function () {
                var v1 = gosu.math.createVector(1, 0);
                var v2 = gosu.math.createVector(1, 1);
                
                expect(v1.signedAngleTo(v2)).toBeCloseTo(45);
            });
            
            it("is -45 between y axis and (1,1)", function () {
                var v1 = gosu.math.createVector(0, 1);
                var v2 = gosu.math.createVector(1, 1);
                
                expect(v1.signedAngleTo(v2)).toBeCloseTo(-45);
            });
        });

        describe("normalizing", function () {
            it("has length 1 after normalizing", function () {
                var v = gosu.math.createVector(1, 1);

                var actual = v.normalize();

                expect(actual.length()).toBeCloseTo(1);
            });

            it("has same direction after normalizing", function () {
                var v = gosu.math.createVector(-1, -1);

                var actual = v.normalize();

                expect(actual).toEqualVector({ x: -1 / Math.sqrt(2), y: -1 / Math.sqrt(2) });
            });
        });

        describe("arithmetic", function () {
            it("yields vector with same direction but multiplied length when multiplying", function () {
                var v = gosu.math.createVector(-0.5, -1);

                var actual = v.multiply(2);

                expect(actual).toEqualVector({ x: -1, y: -2 });
            });

            it("yields vector with same direction but divided length when dividing", function () {
                var v = gosu.math.createVector(-1, -1);

                var actual = v.divide(2);

                expect(actual).toEqualVector({ x: -0.5, y: -0.5 });
            });

            it("yields resulting vector when subtracting other vector", function () {
                var v = gosu.math.createVector(1, -1);

                var actual = v.subtract({ x: -2, y: 3 });

                expect(actual).toEqualVector({ x: 3, y: -4 });
            });

            it("yields resulting vector when adding other vector", function () {
                var v = gosu.math.createVector(-1, 1);

                var actual = v.add({ x: -2, y: 3 });

                expect(actual).toEqualVector({ x: -3, y: 4 });
            });            
        });
    });
});
