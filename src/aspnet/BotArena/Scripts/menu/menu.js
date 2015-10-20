var gosuArena = gosuArena || {};
gosuArena.menu = gosuArena.menu || {};

gosuArena.menu.initialize = function () {
    $("#main-menu-btn").click(function () {
        gosuArena.menu.slideInLeft($("#container-1"));
    });
};

gosuArena.menu.slideInLeft = function (element) {
    $(element).addClass("slide-in-left");
};