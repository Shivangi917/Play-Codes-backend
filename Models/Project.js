const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String }, // Image path if uploaded
});

module.exports = mongoose.model('Project', projectSchema);
