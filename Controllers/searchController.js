// Controllers/searchController.js
const CodeModel = require('../Models/Code');
const UserModel = require('../Models/User');
const ProjectModel = require('../Models/Project');

exports.getSearch = async (req, res) => {
    try {
        const searchTerm = req.query.query; // Get the 'query' parameter from the URL
        console.log("Search term received:", searchTerm); // Check if search term is received

        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }

        const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search
        
        // Search in specific fields
        const userResults = await UserModel.find({
            name: searchRegex // Search only by name
        });

        const codeResults = await CodeModel.find({
            title: searchRegex // Search only by title
        });

        const projectResults = await ProjectModel.find({
            description: searchRegex // Search only by description
        });

        // Combine results with type indicator
        const combinedResults = [
            ...userResults.map(user => ({ type: 'User', name: user.name })),
            ...codeResults.map(code => ({ type: 'Code', title: code.title, description: code.description })),
            ...projectResults.map(project => ({ type: 'Project', description: project.description }))
        ];

        // Return the combined results
        return res.status(200).json(combinedResults);
    } catch (err) {
        console.error("Error during search: ", err);
        return res.status(500).json({ message: "Server error during search" });
    }
};
