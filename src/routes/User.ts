import express from 'express';
import controller from '../controllers/User';

const router = express.Router();

router.get('/register', controller.getRegisterUserPage);
router.get('/login', controller.getLogInUserPage);
router.post('/register', controller.registerUser);
router.post('/login', controller.logInUser);

export = router;