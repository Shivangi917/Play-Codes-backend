// controllers/codes.js

const Code = require('../Models/Code');

exports.getAllCodes = async (req, res) => {
    try {
      const codes = await Code.find().populate('user', 'name email');
      res.status(200).json(codes);
    } catch (err) {
      console.error("Error fetching codes:", err);
      res.status(500).json({ error: "Error fetching codes" });
    }
};