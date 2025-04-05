import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => Math.random().toString(36).substring(2, 8).toUpperCase()
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 86400 // 24 hours in seconds
  }
});

export default mongoose.models.Group || mongoose.model('Group', groupSchema);