const express = require('express');
const { postProject, getProjects } = require('../Controllers/projectController');

const router = express.Router();

router.post('/', postProject);  // Match the function name here
router.get('/', getProjects);

module.exports = router;
