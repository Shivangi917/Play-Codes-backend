import ProjectModel from '../Models/Project.js';
import UserModel from '../Models/User.js';
import path from 'path';

export const postProject = async (req, res) => {
    const { description, useremail } = req.body; // Include useremail here
    console.log("Received description:", description);
    console.log("Received useremail:", useremail);

    try {
        let imagePath = null;
        if (req.file) {
            imagePath = path.join('Images', req.file.filename);
        } else {
            console.warn("No file uploaded.");
        }

        const user = await UserModel.findOne({ email: useremail });
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const newProject = new ProjectModel({
            description,
            image: imagePath,
            user: user._id,
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject);
    } catch (err) {
        console.error("Error creating project space: ", err);
        res.status(500).json({ error: "Error creating project space" });
    }
};

export const getProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find().populate('user', 'name email');
        res.status(200).json(projects);
    } catch (err) {
        console.error("Error fetching projects: ", err);
        res.status(500).json({ error: "Error fetching projects" });
    }
};
