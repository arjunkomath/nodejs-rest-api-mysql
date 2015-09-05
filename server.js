var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var api = require('./api.js');
var config = require('./config');

// Authentication module. 
var auth = require('http-auth');
var basic = auth.basic({
	realm: "Node JS API",
    file: "./keys.htpasswd" // gevorg:gpass, Sarah:testpass ... 
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if(config.auth == true) {
	app.use(auth.connect(basic));
}

app.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  next();
});

router.get('/', function(req, res) {
	res.json({ message: 'Node MySQL API!' });   
});

//our url will always start with api
app.use('/api', api);
app.use('/', router);

app.use(function(req, res, next) {
	res.status(404);
	res.send({
		"success" : 0,
		"message" : 'Invalid URL'
	});
});

var server = app.listen(config.port, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log(config.port);
	console.log('Server listening at http://%s:%s', host, port);
});
