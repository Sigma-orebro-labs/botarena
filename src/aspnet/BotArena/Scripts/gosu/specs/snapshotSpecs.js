///<reference path="~/Scripts/_references.js" />

describe("snapshot", function () {
   it("restoring snapshot resets all properties to the values they had when the snapshot was taken", function () {
       
       var referencedObject = { x: 3 };
       var obj = { a: 1, b: 2, c: referencedObject };

       gosu.snapshot.extend(obj);

       obj.snapshot();

       obj.a = 3;
       obj.b = 5;
       obj.c = {};

       obj.restoreSnapshot();

       expect(obj.a).toEqual(1);
       expect(obj.b).toEqual(2);
       expect(obj.c).toEqual(referencedObject);
   });

    it("restoring partial snapshot only restores properties included in snapshot", function () {
        var obj = { a: 1, b: 2, c: 3, d: 4 };

        gosu.snapshot.extend(obj);

        obj.snapshot("b", "d");

        obj.a = 11;
        obj.b = 12;
        obj.c = 13;
        obj.d = 14;

        obj.restoreSnapshot();

        expect(obj.a).toEqual(11);
        expect(obj.b).toEqual(2);
        expect(obj.c).toEqual(13);
        expect(obj.d).toEqual(4);
    });

    it("first taking a larger snapshot, then a smaller and then restoring just restores the smaller snapshot", function () {
        var obj = { a: 1, b: 2, c: 3 };

        gosu.snapshot.extend(obj);

        obj.snapshot("b", "c");

        obj.a = 11;
        obj.b = 12;
        obj.c = 13;
        obj.d = 14;

        obj.restoreSnapshot();

        obj.snapshot("b");
        
        obj.a = 11;
        obj.b = 12;
        obj.c = 13;
        obj.d = 14;

        obj.restoreSnapshot();
        
        expect(obj.a).toEqual(11);
        expect(obj.b).toEqual(2);
        expect(obj.c).toEqual(13);
        expect(obj.d).toEqual(14);
        
    });

});
