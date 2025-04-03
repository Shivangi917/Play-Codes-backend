import CodeModel from '../Models/Code.js';
import UserModel from '../Models/User.js';
import ProjectModel from '../Models/Project.js';

export const getSearch = async (req, res) => {
    try {
        const searchTerm = req.query.query; // Get the 'query' parameter from the URL
        console.log("Search term received:", searchTerm); // Debug log

        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }

        const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search

        // Search in specific fields
        const userResults = await UserModel.find({ name: searchRegex });
        const codeResults = await CodeModel.find({ title: searchRegex });
        const projectResults = await ProjectModel.find({ description: searchRegex });

        // Combine results with type indicator
        const combinedResults = [
            ...userResults.map(user => ({ type: 'User', name: user.name })),
            ...codeResults.map(code => ({ type: 'Code', title: code.title, description: code.description })),
            ...projectResults.map(project => ({ type: 'Project', description: project.description }))
        ];

        return res.status(200).json(combinedResults);
    } catch (err) {
        console.error("Error during search:", err);
        return res.status(500).json({ message: "Server error during search" });
    }
};
