import CodeModel from '../Models/Code.js';
import UserModel from '../Models/User.js';

export const postCode = async (req, res) => {
    const { title, codeSnippet, description, useremail } = req.body;
    try {
        const user = await UserModel.findOne({ email: useremail });
        if (!user) return res.status(404).json({ error: "User not found" });

        const newCode = new CodeModel({
            title,
            codeSnippet,
            description,
            user: user._id,
        });

        const savedCode = await newCode.save();
        res.status(201).json(savedCode);
    } catch (err) {
        console.error("Error creating code snippet:", err);
        res.status(500).json({ error: "Error creating code snippet" });
    }
};

export const getCodes = async (req, res) => {
    try {
        const codes = await CodeModel.find().populate('user', 'name email');
        res.status(200).json(codes);
    } catch (err) {
        console.error("Error fetching codes:", err);
        res.status(500).json({ error: "Error fetching codes" });
    }
};

export const getUserCodes = async (req, res) => {
    const useremail = req.params.useremail;
    try {
        const user = await UserModel.findOne({ email: useremail });
        if (!user) return res.status(404).json({ message: "User not found" });

        const userCodes = await CodeModel.find({ user: user._id }).populate('user', 'name email');
        res.json(userCodes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user-specific code snippets." });
    }
};