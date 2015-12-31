var app = angular.module('menuApp');

app.factory('notificationService', ['toaster', function (toaster) {

    // Samples of the available toaster types: http://plnkr.co/edit/HKTC1a?p=preview
    // GitHub repo: https://github.com/jirikavi/AngularJS-Toaster

    function showSuccessMessage(title, body) {
        toaster.success({ title: title, body: body });
        console.log(title + ": " + body);
    }

    function showErrorMessage(title, body) {
        toaster.error({ title: title, body: body });
        console.error(title + ": " + body);
    }

    function showUnexpectedErrorMessage(error) {
        toaster.error({ title: "Unexpected error", body: "An unexpected error occurred :/" });
        console.error("Unexpected error: " + JSON.stringify(error));
    }

    return {
        showSuccessMessage: showSuccessMessage,
        showUnexpectedErrorMessage: showUnexpectedErrorMessage,
        showErrorMessage: showErrorMessage
    };
}]);