$(function () {
    $('body').scrollspy({ target: '#profile-menu' });

    $('#show-api-key').click(function () {

        $(this).hide();
        $('#api-key').show();

        return false;
    });
});