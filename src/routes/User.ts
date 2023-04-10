import express from 'express';
import controller from '../controllers/User';
import middleware from '../middleware/TokenVerification';

const router = express.Router();

router.get('/validate', middleware.checkToken, controller.validateUser);
router.get('/register', controller.getRegisterUserPage);
router.get('/login', controller.getLogInUserPage);
router.post('/register', controller.registerUser);
router.post('/login', controller.logInUser);

export = router;