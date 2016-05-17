/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	find: function (req, res) {
		Message.subscribe(req.socket);

		Message.find()
			.sort('createdAt desc')
			.exec(function (err, messages) {
				if (err) {
					throw err;
					return res.badRequest('Error loading transmissions.');
				}

				res.send(messages);
			});
	},

	findOne: function (req, res) {
		var id = req.params.id;

		if (!id) {
			return res.badRequest('No message ID found.');
		}

		Message.findOne(id, function (err, message) {
			if (err) {
				throw err;
			}

			if (!message) {
				return res.badRequest('No message found.');
			}

			var model = {
				message: message,
				json: JSONParser.prettyPrint(message)
			};

			res.view('view', model);
		});
	}
};