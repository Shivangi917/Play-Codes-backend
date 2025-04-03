import express from 'express';
import { postCode, getCodes } from '../Controllers/codeController.js';

const router = express.Router();

router.post('/', postCode);
router.get('/', getCodes);

export default router;
