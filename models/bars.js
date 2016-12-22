let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let barSchema = new Schema({
	zipCode: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	users: [String]
});

let model = mongoose.model('Bar', barSchema);

module.exports = model;