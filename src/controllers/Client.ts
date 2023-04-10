import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Client from '../models/Client';

const createClient = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, phone, address, zipCode } = req.body;

    const client = new Client({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        phone,
        address,
        zipCode
    });

    return client
        .save()
        .then((client) => res.status(201).json({ client }))
        .catch((error) => res.status(500).json({ error }));
};

const readClient = (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.params.clientId;

    return Client.findById(clientId)
        .then((client) => (client ? res.status(200).json({ client }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Client.find()
        .then((clients) => res.status(200).json({ clients }))
        .catch((error) => res.status(500).json({ error }));
};

const updateClient = (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.params.clientId;

    return Client.findById(clientId)
        .then((client) => {
            if (client) {
                client.set(req.body);

                return client
                    .save()
                    .then((client) => res.status(201).json({ client }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                return res.status(404).json({ message: 'not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteClient = (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.params.clientId;

    return Client.findByIdAndDelete(clientId)
        .then((client) => (client ? res.status(204).json({ message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createClient, readClient, readAll, updateClient, deleteClient };