import { Schema, model } from 'mongoose';
import { playerSchema } from './index';

const teamSchema = new Schema({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
});

const Team = model('Team', teamSchema);

export { Team, teamSchema };
