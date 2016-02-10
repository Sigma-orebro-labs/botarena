var app = angular.module('menuApp');

app.factory('notificationService', ['toaster', 'SweetAlert', '$q', function (toaster, SweetAlert, $q) {

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

    function showConfirmationDialog(options) {
        return $q(function(resolve, reject) {
            SweetAlert.swal({
                title: options.title,
                text: options.text,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: options.confirmButtonText,
                cancelButtonText: options.cancelButtonText || "Cancel",
                closeOnConfirm: true
            },
            function (isConfirm) {
                resolve(isConfirm);
            });
        });
    }

    function showBlockigErrorMessage(title, message) {
        return $q(function (resolve, reject) {
            SweetAlert.swal({
                title: title,
                text: message,
                type: "error",
                showCancelButton: false,
                confirmButtonText: "OK",
                closeOnConfirm: true
            },
            function () {
                resolve();
            });
        });
    }

    return {
        showSuccessMessage: showSuccessMessage,
        showUnexpectedErrorMessage: showUnexpectedErrorMessage,
        showErrorMessage: showErrorMessage,
        showConfirmationDialog: showConfirmationDialog,
        showBlockigErrorMessage: showBlockigErrorMessage
    };
}]);