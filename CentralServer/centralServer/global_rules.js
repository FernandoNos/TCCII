exports.checkRules = function(sensor_name, sensor_id,req)
{
	var rules_db = req.db_rules;
	var sensors_db = req.db_sensors;

	var rules_collection = rules_db.get('rules');
	var notification = global.notifications;
	rules_collection.find({'sensor_name':sensor_name,'sensor_id':sensor_id.toString()},{'device_id':1,'_id':0},function(e,docs){
		if(docs.length>0)
		{	
			var registration_ids=[];
			for(var i=0;i<docs.length;i++)
			{
				var registID = docs[i].device_id;
				console.log('device_id ',registID);
				console.log('regis_ids ',registration_ids);
				registration_ids.push(registID);
				notification.sendGCM(registration_ids,"lala");
			}
			console.log('array json ',registration_ids);
		}
	});

}
