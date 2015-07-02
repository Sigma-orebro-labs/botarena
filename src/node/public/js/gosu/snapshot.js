var gosu = gosu || {};
gosu.snapshot = gosu.snapshot || {};

gosu.snapshot.extend = function (obj) {

    var snapshotValues = {};

    function snapshotSelectedProperties(propertyNames) {
        for (var i = 0; i < propertyNames.length; i++) {
            snapshotValues[propertyNames[i]] = obj[propertyNames[i]];
        }
    }

    function snapshotAllOwnProperties() {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                snapshotValues[prop] = obj[prop];                
            }
        }
    }

    obj.snapshot = function () {

        // Performa a complete reset of the previous snapshot,
        // so that nothing more than what is captured in this
        // snapshot can be restored later on
        snapshotValues = {};

        if (arguments.length > 0) {
            snapshotSelectedProperties(arguments);
        } else {
            snapshotAllOwnProperties();
        }
    };

    obj.restoreSnapshot = function () {
        for (var prop in snapshotValues) {
            if (snapshotValues.hasOwnProperty(prop)) {
                obj[prop] = snapshotValues[prop];                
            }
        }
    };
}
