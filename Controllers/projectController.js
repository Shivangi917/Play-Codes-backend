import ProjectModel from '../Models/Project.js';
import UserModel from '../Models/User.js';
import path from 'path';

export const postProject = async (req, res) => {
    const { description, useremail } = req.body; 

    try {
        let imagePaths = [];
        if (req.files) {
            imagePaths = req.files.map(file => path.join('Images', file.filename));
        } else {
            console.warn("No files uploaded.");
        }

        const user = await UserModel.findOne({ email: useremail });
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const newProject = new ProjectModel({
            description,
            image: imagePaths, 
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
        const projects = await ProjectModel.find().populate('user', 'name email').populate({
            path: 'comments.user',  
            select: 'name email'  
        });
        res.status(200).json(projects);
    } catch (err) {
        console.error("Error fetching projects: ", err);
        res.status(500).json({ error: "Error fetching projects" });
    }
};


export const getUserProjects = async (req, res) => {
    const useremail = req.params.useremail;
    try {
        const user = await UserModel.findOne({ email: useremail });
        if (!user) return res.status(404).json({ message: "User not found" });

        const userProjects = await ProjectModel.find({ user: user._id }).populate('user', 'name email').populate({
            path: 'comments.user',  
            select: 'name email'  
        });
        res.status(200).json(userProjects);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user-specific projects." });
    }
};
