var gosuArena = gosuArena || {};
gosuArena.realtime = gosuArena.realtime || {};

gosuArena.realtime.disconnect = function() {
    $.connection.hub.stop();
};

gosuArena.realtime.connect = function (callback) {

    gosuArena.realtime.disconnect();

    if ($.connection.hub && $.connection.hub.state === $.signalR.connectionState.disconnected) {
        $.connection.hub.start().done(function () {
            callback();
        });
    }
};