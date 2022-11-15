import { Schema, model } from 'mongoose';

interface IMatch {
    _id: number;
    team1: string;
    team2: string;
    time: number;
}

const matchSchema = new Schema<IMatch>({
    _id: { type: Number, required: true },
    // team1: { type: mongoose.Types.ObjectId, required: true, ref: 'Team' },
    // team2: { type: mongoose.Types.ObjectId, required: true, ref: 'Team' },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    // Store match date as number for simplification and use of epoch time
    time: { type: Number, required: true },
});

const Match = model<IMatch>('Match', matchSchema);

export { Match };
