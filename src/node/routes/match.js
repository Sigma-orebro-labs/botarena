var fs = require('fs');

module.exports = function(router) {
	
	router.get('/match/bots', function(req, res) {
		var obj = JSON.parse(fs.readFileSync('fakeDb/bots.json', 'utf8'));
		res.json(obj);
	});
	
};