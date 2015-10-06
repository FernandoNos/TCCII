

exports.sendGCM = function (registration_id, message){

console.log('input_regist ',registration_id);
var http = require('http');
var data = {
  "collapseKey":"applice",
  "delayWhileIdle":true,
  "timeToLive":3,
  "data":{
    "message":"My message","title":"My Title"
    },
  "registration_ids":registration_id//["APA91bFOTW4Eo5izcPs7v6L09Rz_exV_7PMnuvS3HzQBixAam8joVFh6PbPLWzeYACIQnvRWFd1rD0iAYhF-GtDtK1CbuaaQbiSu-gkh2FD2CHnmUQSY--uYuXWaY6VlcOSpJIaIPbPhv1CS42n2pbUYI-tFnQLk0w",
                     // "APA91bG0vcgU-Wl2suxGzJ2wg-YsAAPd4glmKBSXO5K6gN3dO7HO0e6ZltPw5CjxKZbJ1ucO5pmB_EOzw3ap3xF8Dx3862ENlWpGb0B2snpYqwStlMsa_Ik1rtenbwX7t3QIkRY8b0KkunjJerasN6DmVoPcthiHXQ"]
};

var dataString =  JSON.stringify(data);
var headers = {
  'Authorization' : 'key=AIzaSyBqA1it_d0fo0NRt2UkTV6pKMBYYsZLYOc',
  'Content-Type' : 'application/json',
  'Content-Length' : dataString.length
};

var options = {
  host: 'android.googleapis.com',
  port: 80,
  path: '/gcm/send',
  method: 'POST',
  headers: headers
};

//Setup the request 
var req = http.request(options, function(res) {
  res.setEncoding('utf-8');

  var responseString = '';

  res.on('data', function(data) {
    responseString += data;
  });

  res.on('end', function() {
    var resultObject = JSON.parse(responseString);
    console.log(responseString);
    console.log(resultObject);
  });
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

});

req.on('error', function(e) {
  // TODO: handle error.
  console.log('error : ' + e.message + e.code);
});

req.write(dataString);
req.end();



}