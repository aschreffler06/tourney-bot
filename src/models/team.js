const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: String,
    players: Array,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = { Team };
