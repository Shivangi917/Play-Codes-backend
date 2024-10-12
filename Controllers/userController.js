const UserModel = require('../Models/User');

exports.signup = (req, res) => {
    UserModel.create(req.body)
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.error("Error creating user:", err);
            res.status(500).json({ error: "Error creating user" });
        });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(401).json({ message: "User not found" });
        if (user.password !== password) return res.status(401).json({ message: "Invalid password" });
        res.status(200).json({ message: "Login successful", user });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
