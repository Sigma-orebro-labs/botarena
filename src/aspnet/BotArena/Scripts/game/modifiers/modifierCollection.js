var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};

gosuArena.factories.modifiers.createModifierCollection = function (modifiers) {

    function calculateFactor(propertyGetter) {
        var baseFactor = 1;

        for (var i = 0; i < modifiers.length; i++) {
            baseFactor += propertyGetter(modifiers[i]) - 1;
        }

        return baseFactor;
    }

    return {
        calculateHealthPointFactor: function() {
            return calculateFactor(function(x) { return x.initialHealthPointFactor; });
        },
        calculateMovementSpeedFactor: function () {
            return calculateFactor(function (x) { return x.movementSpeedFactor; });
        },
        calculateDamageReductionFactor: function () {
            return calculateFactor(function (x) { return x.damageReductionFactor; });
        },
        calculateWeaponDamageFactor: function () {
            return calculateFactor(function (x) { return x.weaponDamageFactor; });
        }
    };
};