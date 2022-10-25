const mongoose = require('mongoose')

// Store match date as number for simplification and use of epoch time
const matchSchema = mongoose.Schema({
    _id: Number,
    team1: String,
    team2: String,
    time: Number
})

const Match = mongoose.model('Match', matchSchema)

module.exports = { Match }