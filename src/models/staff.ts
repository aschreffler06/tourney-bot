import { Schema, model } from 'mongoose';
import { Constants } from './constants';

interface IStaff {
    _id: number;
    role: string;
};

const staffSchema = new Schema<IStaff>({
    // osu! id
    _id: Number,
    role: {
        type: String,
        enum: Constants.STAFF_ROLES,
        required: true
    }
});

const Staff = model('Staff', staffSchema);

export { Staff, staffSchema, IStaff }