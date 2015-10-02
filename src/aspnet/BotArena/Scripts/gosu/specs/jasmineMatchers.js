beforeEach(function () {
    this.addMatchers({
        toBeDefinedFunction: function() {
            var actualValue = this.actual;
            return actualValue && typeof actualValue === 'function';
        },
        toBeEmpty: function () {
            return this.actual.length <= 0;
        },
        matchesRegex: function (regex) {
            return regex.test(this.actual);
        },
        toContainElementMatching: function(predicate) {
            var itemsArray = this.actual;

            for (var i = 0; i < itemsArray.length; i++) {
                if (predicate(itemsArray[i])) {
                    return true;
                }
            }

            return false;
        }
    });
});
