import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    default: "Untitled Page"
  },
  content: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String,
    required: true 
  },
  timestamp: { 
    type: Number, 
    default: Date.now 
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

// Make sure the collection name is explicitly set to 'notes'
const Note = mongoose.model('Note', noteSchema, 'notes');
export default Note;