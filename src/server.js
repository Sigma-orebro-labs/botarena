var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var lessMiddleware = require("less-middleware");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

app.use(lessMiddleware(path.join(__dirname, 'public'), {
	dest: path.join(__dirname, '/public/css'),
	debug: true,
	force: true
}));

app.use(express.static('public'));
app.use(express.static('bower_components'));

var router = express.Router();

// Routes
require('./routes/match')(router);

app.use('/api', router);

app.listen(port);

console.log('Listening on port ' + port);
