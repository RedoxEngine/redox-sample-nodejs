/**
 * TransmissionController
 *
 * @description :: Server-side logic for managing transmissions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find: function(req, res){
		Transmission.subscribe(req.socket);

		Transmission.find()
		.sort('createdAt desc')
		.exec(function(err, transmissions){
			if (err) {
				throw err;
				return res.badRequest('Error loading transmissions.');
			}
			
			res.send(transmissions);
		});
	},
	
	findOne: function(req, res) {
		var id = req.params.id;
		
		if (!id) {
			return res.badRequest('No transmission ID found.');
		}
		
		Transmission.findOne(id, function(err, transmission) {
			if (err) {
				throw err;
			}
			
			if (!transmission) {
				return res.badRequest('No transmission found.');
			}
			
			var model = {
				transmission: transmission, 
				json: JSONParser.prettyPrint(transmission)
			};
			
			res.view('view', model);
		}); 
	},
};