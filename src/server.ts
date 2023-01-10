import express from 'express';
import mongoose from 'mongoose';
import { config } from './config/config';
import clientRoutes from './routes/Client';
import userRoutes from './routes/User';

const router = express();

/** Connect to Mongo */
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('Mongo connected successfully.');
    })
    .catch((error) => console.log(error));

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


/** Rules */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
});

/** Routes */
router.use('/clients', clientRoutes);
router.use('/user', userRoutes);

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');
    console.log(error);

    res.status(404).json({
        message: error.message
    });
});

router.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`)
})