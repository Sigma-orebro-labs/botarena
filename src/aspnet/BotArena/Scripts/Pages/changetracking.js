var gosuArena = gosuArena || {};
gosuArena.changeTracking = gosuArena.changeTracking || {};


$(function () {

    function flagAsDirty($element) {
        $element.attr("data-changed", "true");
    }
    
    function isNonEditingKey(keydownEventArgs) {
        var e = keydownEventArgs;
        return e.which >= 16 && e.which <= 40 || e.which == 9 || e.which == 116; // tab, shift, alt, F5 etc
    };

    var selector = ".change-tracked input, .change-tracked select, .change-tracked textarea";

    $(document)
        .on("change", selector, function () {
            flagAsDirty($(this));
        })
        .on("keydown", selector, function (e) {
            if (isNonEditingKey(e)) {
                return;
            }

            flagAsDirty($(this));
        });

    gosuArena.changeTracking.clearDirtyFlags = function() {
        $("[data-changed]").removeAttr("data-changed");
    };

    $(document).on("click", ".clear-dirty-flags", function () {
        gosuArena.changeTracking.clearDirtyFlags();
    });
    
    gosuArena.changeTracking.hasChangedElements = function() {
        return $(".change-tracked").has("[data-changed]").length > 0;
    };

    window.onbeforeunload = function () {
        var hasChangedElements = gosuArena.changeTracking.hasChangedElements();

        if (hasChangedElements) {
            // There is an issue here with displaying special characters, such as å, ä and ö
            return "There are unsaved changes. Are you sure that you want to leave the page?";
        }
    };
});
