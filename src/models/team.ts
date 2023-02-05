import { Schema, model } from 'mongoose';
import { IPlayer, playerSchema } from './index';

type ITeam = {
    name: string;
    players: IPlayer[];
};

const teamSchema = new Schema<ITeam>({
    name: { type: String, required: true },
    players: { type: [playerSchema], required: true },
});

const Team = model<ITeam>('Team', teamSchema);

export { Team, teamSchema, ITeam };
