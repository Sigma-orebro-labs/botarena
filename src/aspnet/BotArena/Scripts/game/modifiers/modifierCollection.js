var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};

gosuArena.factories.modifiers.createModifierCollection = function (modifiers) {

    function calculateFactor(propertyGetter) {
        var baseFactor = 1;

        for (var i = 0; i < modifiers.length; i++) {
            var safeModifierValue = propertyGetter(modifiers[i]) || 1;
            baseFactor += safeModifierValue - 1;
        }

        return baseFactor;
    }

    return {
        modifiers: modifiers,
        calculateHealthPointFactor: function() {
            return calculateFactor(function(x) { return x.modifiers.initialHealthPointFactor; });
        },
        calculateMovementSpeedFactor: function () {
            return calculateFactor(function (x) { return x.modifiers.movementSpeedFactor; });
        },
        calculateDamageReductionFactor: function () {
            return calculateFactor(function (x) { return x.modifiers.damageReductionFactor; });
        },
        calculateWeaponDamageFactor: function () {
            return calculateFactor(function (x) { return x.modifiers.weaponDamageFactor; });
        },
        calculateWeaponCooldownTimeFactor: function () {
            return calculateFactor(function (x) { return x.modifiers.weaponCooldownTimeFactor; });
        },
        canculateRotationSpeedFactor: function () {
            return calculateFactor(function (x) { return x.modifiers.rotationSpeedFactor; });
        }
    };
};