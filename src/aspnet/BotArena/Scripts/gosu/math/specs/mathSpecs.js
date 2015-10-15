///<reference path="~/Scripts/_references.js" />

describe("math", function () {

    beforeEach(function () {
        jasmine.addMatchers(gosuArena.specs.matchers);
    });

    describe("angles", function () {
        it("0 radians is 0 degrees", function () {
            expect(gosu.math.radiansToDegrees(0)).toEqual(0);
        });

        it("0 degrees is 0 radians", function () {
            expect(gosu.math.degreesToRadians(0)).toEqual(0);
        });

        it("360 degrees is 0 radians", function () {
            expect(gosu.math.degreesToRadians(360)).toEqual(0);
        });

        it("180 degrees is PI radians", function () {
            expect(gosu.math.degreesToRadians(180)).toEqual(Math.PI);
        });

        it("2 PI radians is 0 degrees", function () {
            expect(gosu.math.radiansToDegrees(Math.PI * 2)).toEqual(0);
        });

        it("PI radians is 180 degrees", function () {
            expect(gosu.math.radiansToDegrees(Math.PI)).toEqual(180);
        });

        it("Normalizing positive angle of less than 360 degrees yields same angle", function () {
            expect(gosu.math.normalizeAngleInDegrees(15)).toEqual(15);
            expect(gosu.math.normalizeAngleInDegrees(180)).toEqual(180);
            expect(gosu.math.normalizeAngleInDegrees(0)).toEqual(0);
        });

        it("Normalizing positive angle of more than or equal to 360 degrees yields angle between 0 and 360", function () {
            expect(gosu.math.normalizeAngleInDegrees(360)).toEqual(0);
            expect(gosu.math.normalizeAngleInDegrees(361)).toEqual(1);
            expect(gosu.math.normalizeAngleInDegrees(765)).toEqual(45);
        });

        it("Normalizing negative angle yields positive angle between 0 and 360", function () {
            expect(gosu.math.normalizeAngleInDegrees(-1)).toEqual(359);
            expect(gosu.math.normalizeAngleInDegrees(-180)).toEqual(180);
            expect(gosu.math.normalizeAngleInDegrees(-765)).toEqual(315);
        });
    });
});
