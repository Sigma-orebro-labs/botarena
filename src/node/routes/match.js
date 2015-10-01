//@ sourceURL=match.js
var fs = require('fs');

module.exports = function(router) {
	
	router.get('/match/bots', function(req, res) {

		var obj; 
		var MongoClient = require('mongodb').MongoClient;

		MongoClient.connect('mongodb://BotAdmin:Sigma2015@ds055832.mongolab.com:55832/botarena', function(err, db) {
		    if(err) throw err;

		    var collection = db.collection('bots');

		    // Locate all the entries using find
		    collection.find().toArray(function(err, results) {
		        console.log(results);
		        obj = results; 
		        res.json(obj);
		    });
		});

		//obj = JSON.parse(fs.readFileSync('fakeDb/bots.json', 'utf8'));
		//res.json(obj);
	});
	
};