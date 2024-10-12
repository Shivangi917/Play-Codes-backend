const express = require('express');
const { postCode, getCodes } = require('../Controllers/codeController');

const router = express.Router();

router.post('/', postCode);
router.get('/', getCodes);

module.exports = router;
