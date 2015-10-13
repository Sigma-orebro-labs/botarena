var gosuArena = gosuArena || {};
gosuArena.specs = gosuArena.specs || {};
gosuArena.specs.matchers = gosuArena.specs.matchers || {};

(function () {
    gosuArena.specs.matchers.toBeDefinedFunction = function () {
        return {
            compare: function (actualValue) {

                var result = {};

                result.pass = actualValue && typeof actualValue === 'function';

                return result;
            }
        }
    };

    gosuArena.specs.matchers.toBeEmpty = function() {
        return {
            compare: function (actual) {

                var result = {};

                result.pass = actual.length <= 0;

                return result;
            }
        }
    };

    gosuArena.specs.matchers.toContainElementMatching = function () {
        return {
            compare: function (itemsArray, predicate) {

                var result = {
                    pass: false
                };

                for (var i = 0; i < itemsArray.length; i++) {
                    if (predicate(itemsArray[i])) {
                        result.pass = true;
                    }
                }

                return result;
            }
        }
    };

    gosuArena.specs.matchers.matchesRegex = function () {
        return {
            compare: function (actual, regex) {

                var result = {};

                result.pass = regex.test(actual);

                return result;
            }
        }
    };

})();
