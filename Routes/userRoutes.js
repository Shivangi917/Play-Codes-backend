import express from 'express';
import { signup, login, verifyEmail, logout, getUser } from '../Controllers/userController.js';
import verifyUser from '../Middlewares/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyEmail', verifyEmail);
router.post('/logout', logout);
router.get('/user', verifyUser, getUser);

export default router;
