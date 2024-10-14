const express = require('express');
const { getSearch } = require('../Controllers/searchController');

const router = express.Router();

router.get('/', getSearch);

module.exports = router;
