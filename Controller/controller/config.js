var name = "";
var central_ip = "192.168.0.13";
var id = "";
var local_ip="";
var local_port = '3002';
exports.getControllerName = function(){
	return name;
};

exports.getCentralIP = function(){
	return central_ip;
};

exports.setControllerName = function(controller_name){
	name = controller_name;
};

exports.setCentralIP = function(centralIp){
	central_ip = centralIp;
};

exports.setId = function(val_id){
	var req = {'controller_ip':local_ip,'controller_port':local_port};
    var resStatus = '1';
    var options = {
        uri:'http://localhost:3001/central/getId',
        method:'POST',
        json:req
    }
    var request = require('request');
    request(options,function(error, response,body){
        console.log(body);
        console.log(req);
    });
};

exports.getId = function(){
	return id;
};


exports.setLocalIP = function(){
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

local_ip=addresses[0];
}