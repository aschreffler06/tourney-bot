import { Schema, model, Types } from 'mongoose';
import { MatchEvent, matchEventSchema, IMatchEvent } from './index';

type IMatchHistory = {
    mpLink: string;
    events: IMatchEvent[];
    winner: Types.ObjectId;
};

const matchHistorySchema = new Schema<IMatchHistory>({
    mpLink: { type: String, required: true },
    events: { type: [matchEventSchema], required: true },
    winner: { type: Schema.Types.ObjectId, default: null, required: true, ref: 'Team' }
});

const MatchHistory = model<IMatchHistory>('MatchHistory', matchHistorySchema);

export { MatchHistory, IMatchHistory, matchHistorySchema };