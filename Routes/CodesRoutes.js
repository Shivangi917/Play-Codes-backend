const express = require('express');
const { getAllCodes } = require('../Controllers/Codes');
const Code = require('../Models/Code');
const router = express.Router();

router.get('/codes',getAllCodes);

router.post('/codes', async (req, res) => {
    const { title, description, codeSnippet, userId } = req.body; // userId refers to the ID of the user who posted the code
  
    try {
      const newCode = new Code({ 
        title, 
        description, 
        codeSnippet, 
        user: userId // Save the userId directly
      });
      await newCode.save();
      res.status(201).json(newCode);
    } catch (err) {
      console.error("Error creating new code:", err);
      res.status(500).json({ error: "Error creating new code" });
    }
  });
  
  module.exports = router;