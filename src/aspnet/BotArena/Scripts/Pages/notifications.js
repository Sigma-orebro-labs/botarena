var ga = ga || {};

ga.showNotification = function (message, options) {
    options = options || {};

    $("#notificationContainer").notify({
        message: { text: message },
        type: options.type || "success",
        fadeOut: {
            enabled: options.delay ? true : false,
            delay: options.delay
        }
    }).show();
};