const {model, Schema} = require('mongoose')

let suggestionSetup = new Schema({
    GuildId: String,
    ChannelId: String
})

module.exports = model('SuggestionSetup', suggestionSetup)