var sensorList = [];
var controllers;

//DOM Ready =========================
$(document).ready(function(){
	populateTable();
	populateTableSensors();
	$('#sensorList table tbody').on('click', 'td a.linkshowsensor', showSensorInfo);
	$('#btnAddSensor').on('click',addSensor);
	$('#sensorsList table tbody').on('click','td a.linkdeletesensor',deleteSensor);

});

function deleteSensor(event){
	var confirmation = confirm('Are you sure you want to delete this user?');
	if(confirmation === true){
		$.ajax({
			type:'DELETE',
			url:'http://localhost:3001/sensors/deletesensor/' + $(this).attr('rel')
		}).done(function(response){
			// Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTableSensors();
		});
	}

}

function addSensor(event){
	var newSensor = {
		'sensor_name':$('#addSensor fieldset input#inputSensorName').val(),
		'sensor_id':$('#addSensor fieldset input#inputSensorID').val(),
		'sensor_type':($('#addSensor fieldset input#sensorType').is(':checked'))
	}
	$.ajax({
		url:'http://localhost:3001/sensors/addSensor',
		cache:true,
		type:'POST',
		data:newSensor,
		dataType:'json'
	}).done(function(response){
		$('#addSensor fieldset input').vale('');
	});
	populateTableSensors();
}

//Functions

function populateTableSensors(){
	$.ajax({
		url:'http://localhost:3001/sensors/listSensors',
		cache:true,
		dataType:'json',
		complete: function(data){
			var sensors = JSON.parse(data.responseText);
			var sensor;
			var tableContent='';
			for(var i=0;i<sensors.length;i++)
			{
				sensor = sensors[i];
				tableContent += '<tr>';
				tableContent += '<td><a href="#" class="linkshowsensor" rel="' +sensor.sensor_id + '">' + sensor.sensor_id + '</a></td>';
				tableContent += '<td>'+sensor.sensor_name+"</td>"
				tableContent += '<td>'+sensor.sensor_type+"</td>"
				tableContent += '<td><a href="#" class="linkdeletesensor" rel="'+sensor._id+'">Delete</a></td>';
            	tableContent += '</tr>';
            	
			}
		$('#sensorsList tr').slice(1).remove();
		$('#sensorsList table tbody').append(tableContent);
		}
	});
}

//Fill table with data
function populateTable(){

	//Empty content string
	var tableContent='';
	$.ajax({
		url:'http://localhost:3001/central/getSensors',
		cache:true,
		dataType:'json',
		complete: function(data){
			controllers = JSON.parse(data.responseText);
			var response = controllers;
			var controller;
			var sensorArray;
			var sensor;
			for(var i=0;i<response.length;i++)
			{
				controller = response[i];
				sensorArray = controller.sensors;
				
				for(var j=0;j<sensorArray.length;j++){
					sensor = sensorArray[j].sensor;
					//alert(JSON.stringify(sensor.id));
					tableContent += '<tr>';
					tableContent += '<td><a href="#" class="linkshowsensor" rel="' +sensor.id + '">' + sensor.id + '</a></td>';
            		//tableContent += '<td>' + sensor.id + '</td>';
            		//tableContent += '<td>' + sensor.proximity + '</td>';
            		//tableContent += '<td>' + controller.controller_name + '</td>';
            		//tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + sensor.id + '">delete</a></td>';
            		tableContent += '</tr>';
            	}
			}

		$('#sensorList table tbody').html(tableContent);

		}
	});

	window.showSensorInfo = function showSensorInfo(event){
		clearTable();
		event.preventDefault();
		var thisId = parseInt($(this).attr('rel'),10);
		var sensorArray;
		var sensor;
		var thisObject;
		var arrayPosition;
		var table = $('#sensorDetails tbody');
		for(var i=0;i<controllers.length;i++)
		{
			sensorArray = controllers[i].sensors;
			arrayPosition = sensorArray.map(function(arrayItem){ return arrayItem.sensor.id;}).indexOf(thisId);

			thisObject = sensorArray[arrayPosition];
			table.append('<tr ><td>'+controllers[i].controller_name+'</td><td>'+thisObject.sensor.proximity+'</td><td>'+thisObject.sensor.timestamp+'</td></tr>');
		}

	};

	function clearTable(){
		$('#sensorDetails tr').slice(1).remove();
	}

}