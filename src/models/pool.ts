import { Schema, model } from 'mongoose';
import { mapSchema } from './index';

interface IPool {

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

export { Pool, poolSchema }