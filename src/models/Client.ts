import mongoose, { Schema, Document } from "mongoose";

export interface IClient {
    name: string;
    email: string;
    phone: string;
    address: string;
    zipCode: string;
}

export interface IClientModel extends IClient, Document {}

const ClientSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    zipCode: {
        type: String,
        require: true,
    },
},
    { versionKey: false },
)

export default mongoose.model<IClientModel>('Client', ClientSchema);
