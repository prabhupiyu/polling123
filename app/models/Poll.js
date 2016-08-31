var mongoose = require('mongoose');

// Subdocument schema for votes
var voteSchema = new mongoose.Schema({ /*ip: 'String'*/ userEm:String });

// Subdocument schema for poll choices
var choiceSchema = new mongoose.Schema({ 
	text: String,
	votes: [voteSchema]
});

var commentsSchema =new mongoose.Schema({

	comment : String,
    userid   : String,
    userdp : String
});

// Document schema for polls
/*exports.PollSchema = new mongoose.Schema({
	question: { type: String, required: true },
	choices: [choiceSchema]
});*/

var PollSchema = new mongoose.Schema({
	question: { type: String, required: true },
    category: { type: String, required: true },
	choices: [choiceSchema],
    comments: [commentsSchema]
});

module.exports = mongoose.model('Poll',PollSchema);
