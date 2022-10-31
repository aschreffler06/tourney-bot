const mongoose = require('mongoose');

// Store match date as number for simplification and use of epoch time
const matchSchema = mongoose.Schema({
    _id: { type: Number, required: true },
    team1: { type: mongoose.Types.ObjectId, required: true, ref: 'Team' },
    team2: { type: mongoose.Types.ObjectId, required: true, ref: 'Team' },
    time: { type: Number, required: true },
});

const Match = mongoose.model('Match', matchSchema);

export { Match };
