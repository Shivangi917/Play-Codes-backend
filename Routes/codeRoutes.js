import express from 'express';
import { postCode, getCodes, getUserCodes } from '../Controllers/codeController.js';

const router = express.Router();

router.post('/', postCode);
router.get('/', getCodes);
router.get('/:useremail', getUserCodes);

export default router;
