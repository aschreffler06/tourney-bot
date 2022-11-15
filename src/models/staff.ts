import { Schema, model } from 'mongoose';

interface IStaff {

};

const staffSchema = new Schema<IStaff>({
    // osu! id
    _id: Number,
    role: {
        type: String,
        enum: ['Host', 'Co-Host', 'Pooler', 'Playtester', 'Referee', 'Streamer', 'Commentator', 'GFX', 'Sheeter', 'Mapper'],
        required: true
    }
});

const Staff = model('Staff', staffSchema);

export { Staff, staffSchema }