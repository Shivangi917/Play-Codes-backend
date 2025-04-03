import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String }, // Image path if uploaded
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
