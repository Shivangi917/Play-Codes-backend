import Project from '../Models/Project.js';
import User from '../Models/User.js';

export const addLike = async (req, res) => {
    try {
        const { projectId } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Toggle like (like if not already, otherwise unlike)
        const alreadyLiked = project.likes.includes(user._id);
        if (alreadyLiked) {
            project.likes.pull(user._id);
        } else {
            project.likes.push(user._id);
        }

        await project.save();
        res.status(200).json({ 
            message: alreadyLiked ? "Unliked project" : "Liked project", 
            likes: project.likes.length 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { projectId, commentText } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const newComment = {
            user: user._id,
            commentText: commentText,
            createdAt: new Date(),
        };

        project.comments.push(newComment);
        await project.save();

        res.status(200).json({ message: "Comment added", comment: newComment });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
