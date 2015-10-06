var http = require('http');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/createrule', function(req, res) {
	//Creation date
	var createDate = new Date().getTime()/1000;
	//Device ID - for notification
	//List of sensors
	var body = req.body;
	var db = req.db_rules;
	var collection = db.get('rules');


	for(var i=0;i<body.length;i++)
	{
		var rule = body[i];
		collection.insert(rule);
	}

	res.send('Success');

});



module.exports = router;
