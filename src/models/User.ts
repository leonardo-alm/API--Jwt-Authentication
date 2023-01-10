import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
    email: string;
    username: string;
    password: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
    },
},
    { versionKey: false },
)

export default mongoose.model<IUserModel>('User', UserSchema);
