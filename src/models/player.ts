import { Schema, model } from 'mongoose';

const playerSchema = new Schema({
    _id: { type: Number, required: true },
    discord: { type: Number, required: true },
    rank: { type: Number, required: true },
    badges: { type: Number, required: true },
    // number relative to UTC
    timezone: { type: Number },
    country: { type: String }
});

const Player = model('Player', playerSchema);

export { Player, playerSchema };