import express from 'express';
import { addLike, addComment } from '../Controllers/projectActivityController.js';
import verifyUser from '../Middlewares/auth.js';

const router = express.Router();

router.post('/like', verifyUser, addLike);
router.post('/comment', verifyUser, addComment);

export default router;