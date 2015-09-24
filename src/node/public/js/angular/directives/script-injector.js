botArena.directive("scriptInjector", function() {
 
    var updateScripts = function (element) {
        return function (scripts) {
            console.log(scripts);
            element.empty();
            angular.forEach(scripts, function (source, key) {
                var scriptTag = angular.element(document.createElement("script"));
                scriptTag.text(source);
                element.append(scriptTag);
            });
        };
    };
 
    return {
        restrict: "EA",
        scope: {
          scripts: "=" 
        },
        link: function(scope,element) {
            scope.$watch("scripts", updateScripts(element));
        }
    };
});