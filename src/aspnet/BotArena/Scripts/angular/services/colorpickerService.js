var app = angular.module('menuApp');

app.factory('colorpickerService', [function () {

    function initialize(defaultValue, changeCallback) {
        $(".colorpicker").minicolors({
            control: 'hue',
            letterCase: 'uppercase',
            defaultValue: defaultValue || '#f00',
            format: 'hex',
            change: function (hex) {
                changeCallback(hex);
            },
        });
    };

    return {
        initialize: initialize
    };
}]);