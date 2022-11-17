import { Schema, model } from 'mongoose';
import { mapSchema, IMap } from './index';
import { Constants } from './constants';

interface IPool {
    maps: IMap[];
    numMaps: number;
    round: string;
    targetSr: number;
};

const poolSchema = new Schema<IPool>({
    maps: { type: [mapSchema], default: [], required: true },
    numMaps: { type: Number, required: true },
    round: {
        type: String,
        enum: Constants.TOURNEY_ROUNDS
    },
    targetSr: { type: Number, required: true }
});

const Pool = model('Pool', poolSchema);

export { Pool, poolSchema, IPool }