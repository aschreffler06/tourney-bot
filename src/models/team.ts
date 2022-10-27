const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    name: { type: String, required: true },
    players: { type: Array, required: true }
});

const Team = mongoose.model('Team', teamSchema);

export { Team };
