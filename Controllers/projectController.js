const ProjectModel = require('../Models/Project');
const UserModel = require('../Models/User');

exports.postProject = async (req, res) => {
    const { description, useremail } = req.body; // Include useremail here
    try {
        const user = await UserModel.findOne({ email: useremail }); // Find user by email
        if (!user) return res.status(404).json({error: "User not found"});

        const newProject = new ProjectModel({
            description,
            user: user._id, // Store the user's ID in the project
        });

        const savedProject = await newProject.save();
        res.status(201).json(savedProject); // Respond with the created project
    } catch (err) {
        console.error("Error creating project space: ", err);
        res.status(500).json({ error: "Error creating project space" });
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await ProjectModel.find().populate('user', 'name email');
        res.status(200).json(projects); // Respond with the list of projects
    } catch (err) {
        console.error("Error fetching projects: ", err);
        res.status(500).json({ error: "Error fetching projects" });
    }
};
