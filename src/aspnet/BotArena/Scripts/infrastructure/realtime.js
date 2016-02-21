var gosuArena = gosuArena || {};
gosuArena.realtime = gosuArena.realtime || {};

(function() {

    function isConnected() {
        return $.connection.hub && $.connection.hub.state === $.signalR.connectionState.connected;
    };

    function disconnect() {
        $.connection.hub.stop();
    };

    function connect(callback) {

        gosuArena.realtime.disconnect();

        if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
            $.connection.hub.start().done(function () {
                callback();
            });
        }
    };

    function call(action) {
        if (!gosuArena.realtime.isConnected()) {
            gosuArena.realtime.connect(function() {
                action($.connection);
            });
        } else {
            action($.connection);
        }
    }

    gosuArena.realtime.isConnected = isConnected;
    gosuArena.realtime.disconnect = disconnect;
    gosuArena.realtime.connect = connect;
    gosuArena.realtime.call = call;

})();
