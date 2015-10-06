var http = require('http');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
	res.render('sensors');
});

router.get('/listSensors',function(req,res){
	var db = req.db_sensors;
	var collection = db.get('sensors');

	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

router.post('/addSensor', function(req,res){
	var ret = 'Success';
	console.log(req.body);
	var db = req.db_sensors;
	var collection = db.get('sensors');
	var error;
	collection.insert(req.body, function(err, result){
		console.log(err);
	});


});

router.delete('/deletesensor/:id',function(req,res){
	var db = req.db_sensors;
	var collection = db.get('sensors');
	var sensorToDelete = req.params.id;
	collection.remove({'_id':sensorToDelete},function(err){
		res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
	});
});





module.exports = router;
