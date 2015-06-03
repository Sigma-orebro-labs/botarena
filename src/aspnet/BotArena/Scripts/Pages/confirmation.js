$(function () {
    $(document).on("click", "[type=submit][data-confirm]", function () {

        var message = $(this).attr("data-confirm");
        var wasConfirmed = confirm(message);
        
        return wasConfirmed;
    });
});