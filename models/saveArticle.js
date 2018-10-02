var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newSchema = new Schema({
	title: {
		type: String, default: ""
	},
	summary: {
		type: String, default: ""
	},
	link: {
		type: String, default: ""
	},
	byline: {
		type: String, default: ""
	},
	img: {
		type: String, default: ""
	},
	comments:[{
		type: Schema.Types.ObjectId, ref: "Comment",
	}]
});


module.exports = mongoose.model("saved", newSchema);