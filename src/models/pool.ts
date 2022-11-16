import { Schema, model } from 'mongoose';
import { mapSchema, IMap } from './index';

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
        enum: ['Group Stage', 'Ro128', 'Ro64', 'Ro32', 'Ro16', 'QF', 'SF', 'F', 'GF']
    },
    targetSr: { type: Number, required: true }
});

const Pool = model('Pool', poolSchema);

export { Pool, poolSchema, IPool }