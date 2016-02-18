var gosuArena = gosuArena || {};
gosuArena.factories = gosuArena.factories || {};
gosuArena.factories.modifiers = gosuArena.factories.modifiers || {};

gosuArena.factories.modifiers.createModifierCollection = function (modifiers) {

    function calculateFactor(propertyGetter) {
        var baseFactor = 1;

        for (var i = 0; i < modifiers.length; i++) {
            var safeModifierValue = propertyGetter(modifiers[i]) || 1;

            if (baseFactor < 1 && safeModifierValue < 1) {

                // We can't keep subtracting unconditionally since that might cause
                // the base factor to become 0 or even negative. So, fall back to
                // reducing the base factor by a a factor instead of an absolute value.
                baseFactor *= safeModifierValue;
            } else {
                baseFactor += safeModifierValue - 1;
            }
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