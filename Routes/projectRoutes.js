import express from 'express';
import { postProject, getProjects, getUserProjects } from '../Controllers/projectController.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedTypes = /jpeg|jpg|png|gif/; // Allowed file types

const fileFilter = (req, file, cb) => {
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
    fileFilter: fileFilter
});

router.post('/', upload.array('images'), postProject);
router.get('/', getProjects);
router.get('/:useremail', getUserProjects);

export default router;
