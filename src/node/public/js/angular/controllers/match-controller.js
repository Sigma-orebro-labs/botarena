
botArena.controller('matchController', function ($scope, $http, botScriptFactoryService) {
	$http.get('api/match/bots')
		.success(function(data) {
			$scope.bots = botScriptFactoryService.createScripts(data);
		});
});