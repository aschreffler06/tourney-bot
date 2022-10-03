const mongoose = require('mongoose')

const matchSchema = mongoose.Schema({
    team1: String,
    team2: String,
    matchTime: Date
})

const MatchMessage = mongoose.model('MatchMessage', matchSchema)

module.exports = MatchMessage