import express from 'express';
import { getSearch } from '../Controllers/searchController.js';

const router = express.Router();

router.get('/', getSearch);

export default router;
