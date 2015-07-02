$(function () {

    gosuArena.events.gameStarting(function () {
        $("#restartMatch").html("Restart match")
            .removeClass('btn-primary')
            .addClass('btn-default');
    });

});