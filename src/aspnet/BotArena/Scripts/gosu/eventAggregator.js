var gosu = gosu || {};

gosu.eventAggregator = (function () {
    var callbacks = {};

    function unsubscribeAll(eventName) {
        if (callbacks[eventName]) {
            callbacks[eventName].length = 0;            
        }
    }

    function publish(eventName, eventArgs) {
        if (callbacks[eventName]) {
            callbacks[eventName].forEach(function (callback) {
                callback(eventArgs);
            });
        }
    }

    function subscribe(eventName, callback) {
        if (!callbacks[eventName]) {
            callbacks[eventName] = [];
        }

        callbacks[eventName].push(callback);
    }

    return {
        publish: publish,
        subscribe: subscribe,
        unsubscribeAll: unsubscribeAll
    };
})();
