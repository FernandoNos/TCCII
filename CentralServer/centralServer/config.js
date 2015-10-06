var controller_id = 0;

exports.getNextControllerId = function()
{
	return controller_id++;
}