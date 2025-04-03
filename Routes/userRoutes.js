import express from 'express';
import { signup, login, verifyEmail, logout } from '../Controllers/userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyEmail', verifyEmail);
router.post('/logout', logout);

export default router;
