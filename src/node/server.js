var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;

app.use(express.static('public'));

var router = express.Router();

require('./routes/match')(router);

app.use('/api', router);

var port = process.env.PORT || 8080;

app.listen(port);

console.log('Listening on port ' + port);
