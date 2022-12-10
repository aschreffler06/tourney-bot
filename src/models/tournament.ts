import { Schema, model, Types } from 'mongoose';
import { teamSchema, staffSchema, poolSchema, ITeam, IStaff, IPool, IMatch, matchSchema } from './index';
import { Constants } from './constants'

interface ITournament {
    host: string;
    forumPost: string;
    bracketLink: string;
    acronym: string;
    minTeamSize: number;
    maxTeamSize: number;
    format: string;
    bws: Schema.Types.Mixed; // callback function for calculating bws
    signups: ITeam[];
    numQualify: number;
    staff: IStaff[];
    pools: IPool[];
    matchList: IMatch[];
    guildId: string;
    state: string;
}

const tournamentSchema = new Schema<ITournament>({
    host: { type: String, required: true },
    forumPost: { type: String, required: true },
    bracketLink: { type: String },
    acronym: { type: String, required: true },
    minTeamSize: { type: Number, required: true },
    maxTeamSize: { type: Number, required: true },
    format: {
        type: String,
        enum: Constants.FORMAT,
        default: '1v1',
        required: true
    },
    bws: {
        type: Schema.Types.Mixed,
        default: (rank: number, badges: number) => {
            return rank ^ (0.9937 ^ (badges ^ 2))
        },
        required: true
    },
    signups: { type: [teamSchema], default: [], required: true },
    numQualify: { type: Number, required: true },
    staff: { type: [staffSchema], default: [], required: true },
    pools: { type: [poolSchema], default: [], required: true },
    matchList: { type: [matchSchema], default: [], required: true },
    guildId: { type: String, required: true },
    state: {
        type: String,
        enum: Constants.TOURNEY_STATE,
        default: Constants.TOURNEY_STATE[0],
        required: true
    }
    // TODO: (Bracket) Seeding information,
})

const Tournament = model('Tournament', tournamentSchema);

export { Tournament }