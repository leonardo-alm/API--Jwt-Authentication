import express from 'express';
import controller from '../controllers/Client';
import middleware from '../middleware/TokenVerification';

const router = express.Router();

router.post('/create', middleware.checkToken, controller.createClient);
router.get('/get/:clientId', middleware.checkToken, controller.readClient);
router.get('/get', middleware.checkToken, controller.readAll);
router.patch('/update/:clientId', middleware.checkToken, controller.updateClient);
router.delete('/delete/:clientId', middleware.checkToken, controller.deleteClient);

export = router;