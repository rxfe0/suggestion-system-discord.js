const {model, Schema} = require('mongoose')

let SuggestionSchema = new Schema({
    GuildId: String,
    MessageId: String,
    Details: Array
});

module.exports = model('Suggestion', SuggestionSchema)
