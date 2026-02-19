import express from 'express';
import { 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote,
  getNoteById,
  deleteAllNotes 
} from '../controllers/noteController.js';

const router = express.Router();

// Base route: /api/notes
router.get('/', getNotes);              // Get all notes
router.post('/', createNote);            // Create a new note
router.get('/:id', getNoteById);         // Get a single note
router.put('/:id', updateNote);           // Update a note
router.delete('/:id', deleteNote);        // Delete a note
router.delete('/clear/all', deleteAllNotes); // Delete all notes (use carefully!)

export default router;