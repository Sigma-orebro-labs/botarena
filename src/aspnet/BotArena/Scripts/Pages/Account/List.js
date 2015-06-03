$(function() {
    $("form.reset-password").submit(function() {
        $(this).ajaxSubmit({
            success: function(data) {
                ga.showNotification("The new password is: " + data);
            },
            error: function() {
                ga.showNotification("Something went wrong", { type: "error" });
            }
        });
        
        return false;
    });
});