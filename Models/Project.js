import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: [{ type: String }],
  
  likes: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  ],

  comments: [
    { 
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      commentText: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }, 
    }
  ]
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
