const mongoose = require('mongoose');

// Store match date as number for simplification and use of epoch time
const matchSchema = mongoose.Schema({
    _id: Number,
    team1: mongoose.Schema.ObjectId,
    team2: mongoose.Schema.ObjectId,
    time: Number,
});

const Match = mongoose.model('Match', matchSchema);

module.exports = { Match };
