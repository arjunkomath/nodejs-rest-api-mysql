var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var Sequelize = require('sequelize');

//Initialize database
var sequelize = new Sequelize('database', 'username', 'password');
var TABLE_PREFIX = "prefix_";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.get('/', function(req, res) {
	res.json({ message: 'Node MySQL API!' });   
});

//Create 
router.post('/:table', function(req, res) {
	sequelize.query("SHOW KEYS FROM `"+TABLE_PREFIX+req.params.table+"` WHERE Key_name = 'PRIMARY'", { type: sequelize.QueryTypes.SELECT})
	.then(function(keys) {
		var primary_key = keys[0].Column_name;
		if(JSON.stringify(req.body) == '{}') {
			res.status(404);
			res.json({
				"success" : 0,
				"message" : "Parameters missing"
			});
			return false;
		}
		var keys = '';
		var values = '';
		Object.keys(req.body).forEach(function(key, index) {
			var val = req.body[key];
			keys += "`"+key+"`";
			values += "'"+val+"'";
			if(Object.keys(req.body).length != (index+1)) {
				keys += ',';
				values += ',';
			}
		});
		sequelize.query("INSERT INTO `"+TABLE_PREFIX+req.params.table+"` (" + keys + ") VALUES ("+values+")", { type: sequelize.QueryTypes.INSERT})
		.then(function(id) {
			res.status(201);
			res.json({
				"success" : 1,
				"id" : id
			});
		})
		.catch( function(err) {
			res.status(404);
			res.send({
				"success" : 0,
				"message" : err.message
			});
		});
	})
	.catch( function(err) {
		res.status(404);
		res.send({
			"success" : 0,
			"message" : err.message
		});
	});
});

//Update by ID 
router.put('/:table/:id', function(req, res) {
	sequelize.query("SHOW KEYS FROM `"+TABLE_PREFIX+req.params.table+"` WHERE Key_name = 'PRIMARY'", { type: sequelize.QueryTypes.SELECT})
	.then(function(keys) {
		var primary_key = keys[0].Column_name;
		if(JSON.stringify(req.body) == '{}') {
			res.status(204);
			res.json({
				"success" : 0,
				"message" : "Parameters missing"
			});
			return false;
		}
		var update_string = '';
		Object.keys(req.body).forEach(function(key) {
			var val = req.body[key];
			update_string += "`" + key + "` = '" + val + "'"; 
		});
		sequelize.query("UPDATE `"+TABLE_PREFIX+req.params.table+"` SET " + update_string + " WHERE `"+primary_key+"` = '"+req.params.id+"'", { type: sequelize.QueryTypes.UPDATE})
		.then(function() {
			res.status(200);
			res.json({
				"success" : 1,
				"message" : "Updated"
			});
		})
		.catch( function(err) {
			res.status(404);
			res.send({
				"success" : 0,
				"message" : err.message
			});
		});
	})
	.catch( function(err) {
		res.status(404);
		res.send({
			"success" : 0,
			"message" : err.message
		});
	});
});

//Read 
router.get('/:table', function(req, res) {
	sequelize.query("SELECT * FROM `"+TABLE_PREFIX+req.params.table+"`", { type: sequelize.QueryTypes.SELECT})
	.then(function(rows) {
		if(!rows.length) {
			res.status(404);
			res.json({
				"success" : 0,
				"data" : "No rows found"
			});
		}
		res.status(200);
		res.json({
			"success" : 1,
			"data" : rows
		});
	})
	.catch( function(err) {
		res.status(404);
		res.send({
			"success" : 0,
			"message" : err.message
		});
	});
});

//Read by ID 
router.get('/:table/:id', function(req, res) {
	sequelize.query("SHOW KEYS FROM `"+TABLE_PREFIX+req.params.table+"` WHERE Key_name = 'PRIMARY'", { type: sequelize.QueryTypes.SELECT})
	.then(function(keys) {
		var primary_key = keys[0].Column_name;
		sequelize.query("SELECT * FROM `"+TABLE_PREFIX+req.params.table+"` WHERE `"+primary_key+"` = '"+req.params.id+"'", { type: sequelize.QueryTypes.SELECT})
		.then(function(rows) {
			if(!rows.length) {
				res.status(404);
				res.json({
					"success" : 0,
					"data" : "No rows found"
				});
			}
			res.status(200);
			res.json({
				"success" : 1,
				"data" : rows
			});
		})
		.catch( function(err) {
			res.status(404);
			res.send({
				"success" : 0,
				"message" : err.message
			});
		});
	})
	.catch( function(err) {
		res.status(404);
		res.send({
			"success" : 0,
			"message" : err.message
		});
	});
});

//Delete by ID 
router.delete('/:table/:id', function(req, res) {
	sequelize.query("SHOW KEYS FROM `"+TABLE_PREFIX+req.params.table+"` WHERE Key_name = 'PRIMARY'", { type: sequelize.QueryTypes.SELECT})
	.then(function(keys) {
		var primary_key = keys[0].Column_name;
		sequelize.query("DELETE FROM `"+TABLE_PREFIX+req.params.table+"` WHERE `"+primary_key+"` = '"+req.params.id+"'", { type: sequelize.QueryTypes.DELETE})
		.then(function() {
			res.status(200);
			res.json({
				"message": "Deleted"
			});
		})
		.catch( function(err) {
			res.status(404);
			res.send(err.message);
		});
	})
	.catch( function(err) {
		res.status(404);
		res.send(err.message);
	});
});

//our url will always start with api
app.use('/api', router);

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});