import { Schema, model } from 'mongoose';
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
    signups: ITeam[];
    numQualify: number;
    staff: IStaff[];
    pools: IPool[];
    matchList: IMatch[];
    guildId: string;
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
        enum: Constants.FORMAT,
        default: '1v1',
        required: true
    },
    signups: { type: [teamSchema], default: [], required: true },
    numQualify: { type: Number, required: true},
    staff: { type: [staffSchema], default: [], required: true },
    pools: { type: [poolSchema], default: [], required: true },
    matchList: { type: [matchSchema], default: [], required: true },
    guildId: { type: String, required: true },
    // TODO: (Bracket) Seeding information,
})

const Tournament = model('Tournament', tournamentSchema);

export { Tournament }