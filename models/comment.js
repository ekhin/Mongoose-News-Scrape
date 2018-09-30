var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var commentSchema = new Schema({
	comment: {
		type: String, default: ""
	}
});



module.exports = mongoose.model('Comment', commentSchema);
