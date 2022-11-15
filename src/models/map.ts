import { Schema, model } from 'mongoose';

interface IMap {

};

const mapSchema = new Schema<IMap>({
    mapId: { type: Number, required: true },
    mod: {
        type: String,
        // TODO: Make these able to be appended to each other
        enum: ['NM', 'HD', 'HR', 'DT', 'FM', 'TB', 'EZ', 'FL', 'ACC'],
        required: true
    },
    slot: { type: Number, required: true },
    multiplier: { type: Number, default: 1, required: true },
    comment: { type: String }
});

const Map = model('Map', mapSchema);

export { Map, mapSchema }