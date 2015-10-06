var express = require('express');
var router = express.Router();
var config = global.config;
var util = require('util');
var request = require('request');

function sendControllerUpdate(obj){
    var resStatus = '1';
    var options = {
        uri: 'http://localhost:3001/central/updateController',
        method: 'POST',
        json: obj
    };
    request(options, function(error, response,body){
        if (!error && response.statusCode == 200) {
            console.log(body) // Print the shortened url.
            resStatus = '0';
        }
    });

    return {'status':resStatus};
}


/*function getControllerId(){
    var req = {'controller_ip':global.config.local_ip,'controller_port':global.config.local_port};
    var resStatus = '1';
    var options = {
        uri:'http://localhost:3001/central/getId',
        method:'POST',
        json:req
    }
    request(options,function(error, response,body){
        if (!error && response.statusCode == 200) {
            console.log('getControllerId: ',body) // Print the shortened url.
            resStatus = '0';
        }
    });
}*/

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a controller');
});


//Displays the agents that have been detected
router.get('/getagents', function(req,res){
	    var db = req.db;
    	var collection = db.get('controller');
	    collection.find({},{},function(e,docs){
        res.json(docs);
    }); 
});

//Called when the controller is configured
/*router.post('/createController', function(req,res){
    
    //config.setControllerName(req.body.nome_controlador);
    //config.setCentralIP(req.body.ip_central);
    var name = config.getControllerName();
    var ip = config.getCentralIP();

    var id = getControllerId();
    config.setID(id);
    var request = {''}

    res.send(name);
   
});*/

//Called by the detector, providing the details
router.post('/addagent', function(req, res) {	
    var db = req.db;
    console.log('ADDAGENT REQ ',req.body);
    var collection = db.get('controller');
    var controllers = req.body.controllers;
    var error=null;
    var name = config.getControllerName();
    var controller_id = req.body.controllers[0].controller_id;
    var jsonArray = {"sensors":[]};
    var jsonObj={"name_controller":name,"controller_id":controller_id};
    var sensor ;

    if(controllers.length && controllers.length >0)
    {
    	 for(var i=0; i < controllers.length && !error; ++i)
    {
    			var cController = controllers[i];
                sensor = {"sensor":cController};
                jsonArray.sensors.push(sensor);

    			collection.insert(cController, function(err, result){
        		error = err;
    		});
    	}

        jsonObj["sensors"]=jsonArray.sensors;
       //console.log("controller.js_jsonObj: ",util.inspect(jsonObj,false,null));
       console.log(jsonObj);
        res.json(sendControllerUpdate(req.body));//jsonObj));
    }

    
});

module.exports = router;
