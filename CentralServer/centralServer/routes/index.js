var http = require('http');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {

var url = 'http://localhost:3002/controller/getagents';
var jsonObject;
http.get(url, function(resp){
	    var body = '';

    resp.on('data', function(chunk){
        body += chunk;
    });

    resp.on('end', function(){
        var jsonObject = JSON.parse(body);
        console.log("Got a response: ", jsonObject);
	    res.json(jsonObject);

    });
});

});



module.exports = router;
