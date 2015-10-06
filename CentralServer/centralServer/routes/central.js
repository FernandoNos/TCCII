var http = require('http');
var express = require('express');
var router = express.Router();
var query_results;

router.get('/',function(req,res){
	  res.render('central', { title: 'Express' });
});

router.post('/getId', function(req,res){
	var config = global.config;
	var id = config.getNextControllerId();
	console.log(req.body);

	var db = req.db_controllers;
	var collection = db.get('controllers');
	collection.insert(req.body,function(e){
		if(e)
			console.logs(e);
	});

	res.json({'controller_id':id});
});

//Displays all the data that has been stored so far
//Controller + sensors
router.get('/getSensors', function(req,res){
	var db = req.db;
	var collection = db.get('central');
	collection.find({},{},function(e,docs){
		res.json(docs);
	});
});

/* GET home page. */
router.post('/updateController', function(req, res) {



	console.log('updateController ',req.body);
	setSensorNomes(req.body,req);


	//Get the data from the request
	/*var controller_name = req.body.controller_name;
	var controller_id = req.body.controller_id;
	var controller = req.body;
	var sensors = req.body.sensors;
	getSensorRegion(sensors,req);
	var error = null;
	if(sensors.length && sensors.length>0)
	{
		for(var i=0;i<sensors.length && !error;i++)
		{
			var element = sensors[i];
			element.sensor.timestamp= timestamp = new Date().getTime()/1000;
			getSensorNome(element.sensor.id,req,controller_id,element,controller)
		}
		res.json({"status":"1"});
	}

	*/
	});

function setSensorNomes(sensors,req){
	var sensors = sensors.controllers;
	var db = req.db_sensors;
	var ids = [];
	console.log('sensors ',sensors);
	for(var i=0;i<sensors.length;i++)
	{
		ids.push(sensors[i].id.toString());
	}
	console.log('ids ',ids);

	var collection = db.get('sensors');
	var jsonQuery = require('json-query');
	collection.find({sensor_id: {$in: ids}},{},function(e,docs){
		console.log('docs ',docs);
		for(var i=0;i<sensors.length;i++)
		{
			var element = sensors[i];

			var filtered = jsonQuery(['[sensor_id=?]',element.id.toString()],{data: docs});

			element.sensor_name = filtered.value.sensor_name;
			element.sensor_type = filtered.value.sensor_type;

		}
		console.log('final ',sensors);
		findRegions(sensors,req);


	});
}

function findRegions(sensors,req){
	console.log('findRegions - sensors ',sensors);
	var regions =[];
	for(var i=0;i<sensors.length;i++){
		var element = sensors[i];
		if(element.sensor_type=='true'){
			regions.push(element);
			sensors.splice(i,1);
		}
	}
	if(sensors.length>0){
		for(var i=0;i<regions.length;i++){
			var region = regions[i];
			region.sensors = sensors;
		}
		//Incluir agora a chamada para mandar as regiões encontradas e mandar a notificação corretamente
	}
}


function getSensorRegion(sensors,req){

	var ids=[];
	console.log('sensors ',sensors);
	for(var i=0;i<sensors.length;i++)
	{
		var element = sensors[i];
		var id = element.sensor.id;
		ids.push(id.toString());
	}
	console.log('IDS ',ids);


	var db = req.db_sensors;
	var collection = db.get('sensors');

	collection.find({'sensor_id': {$in: ids},'sensor_type':'true'},{},function(e,docs){
		console.log('DOCS ',docs);
	});

}

function performUpdate(controller_id,element,name,req,controller){
	element.sensor.name = name;
		//Create DB interface
				var db = req.db;
				var collection = db.get('central');

				collection.update(
				{
					//Finds entry with the same ID as the
					//controller that sent the request
					//"controller_name":controller_id,
					"controller_id":controller_id,
					"sensors.sensor.id":element.sensor.id
				},
				{
					$set: {"sensors.$.sensor.proximity":element.sensor.proximity,
						   "sensors.$.sensor.timestamp":element.sensor.timestamp,
						   "sensors.$.sensor.name":element.sensor.name},
					//Updates the entry with the data of the sensor received
					$setOnInsert :{
						"sensors.$.sensor":element.sensor
					}

				},
				{
					upsert:true
				}
				,
				function (err, object){
					if(err){
						 console.warn(err.message);  // returns error if no matching object found
						// addController(controller,element,req);
					}
					else{
          				console.log('aqui ',object);
      				}
				}
			);
			var rules = global.rules;
			rules.checkRules(element.sensor.name, element.sensor.id,req);
}


/*function addController(cController,sensor,req){
	var db = req.db;
	var collection = db.get('central');
	var controller_id = cController.controller_id;
	collection.update(
		{
			//Finds entry with the same ID as the
			//controller that sent the request
			controller_id:controller_id
		},
			{
				//Updates the entry with the data of the sensor received
				$push:{
					sensors:sensor
				},
				$setOnInsert:{
					"controller_name":cController.name_controller,
					"controller_id": cController.controller_id
				}
			},
			{
				upsert:true
			}
		);
}*/

function getSensorNome(id,req,controller_id,element,controller){
	var db = req.db_sensors;
	var collection = db.get('sensors');
	console.log(id.toString());
	collection.find({'sensor_id':id.toString()},{'sensor_id':true},function(e,docs){
		if(docs){
			query_results = docs[0].sensor_name;
			performUpdate(controller_id,element,query_results,req,controller)
		}
	});
}

module.exports = router;
