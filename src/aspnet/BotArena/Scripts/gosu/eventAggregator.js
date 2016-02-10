var gosu = gosu || {};

gosu.eventAggregator = (function () {
    var callbacks = {};

    function unsubscribeAll() {
        for (var prop in callbacks) {
            if (callbacks.hasOwnProperty(prop) && callbacks[prop].length) {
                callbacks[prop].length = 0;
            }
        }
    }

    function unsubscribeAllForEvent(eventName) {
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
        unsubscribeAllForEvent: unsubscribeAllForEvent,
        unsubscribeAll: unsubscribeAll
    };
})();
