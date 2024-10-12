const express = require('express');
const { postProject, getProjects } = require('../Controllers/projectController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const allowedTypes = /jpeg|jpg|png|gif/; // Allowed file types

const fileFilter = (req, file, cb) => {
    // Check if the file type matches the allowed types
    if (allowedTypes.test(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('File type not supported!'), false); // Reject the file
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../Public/Images')); // Use absolute path
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter // Add fileFilter to multer configuration
});

router.post('/', upload.single('image'), postProject); // Match the function name here
router.get('/', getProjects);

module.exports = router;
