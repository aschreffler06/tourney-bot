import { Schema, model } from 'mongoose';
import { teamSchema, staffSchema, poolSchema } from './index';

interface ITournament {

}

const tournamentSchema = new Schema<ITournament>({
    host: { type: String, required: true},
    forumPost: { type: String, required: true},
    bracketLink: { type: String },
    acronym: { type: String, required: true},
    minTeamSize: { type: Number, required: true},
    maxTeamSize: { type: Number, required: true},
    format: {
        type: String,
        enum: ['1v1', '2v2', '3v3', '4v4'],
        default: '1v1',
        required: true
    },
    signups: { type: [teamSchema], default: 0, required: true },
    numQualify: { type: Number, required: true},
    staff: { type: [staffSchema], default: [], required: true },
    pools: { type: [poolSchema], default: [], required: true },
    // TODO: (Bracket) Seeding information,
})

const Tournament = model('Tournament', tournamentSchema);

export { Tournament }