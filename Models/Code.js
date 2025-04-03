import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    codeSnippet: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User model
});

const Code = mongoose.model('Code', codeSchema);
export default Code;
