import Note from '../models/Note.js';

// @desc    Get all notes
// @route   GET /api/notes
export const getNotes = async (req, res) => {
  console.log("🔍 GET REQUEST: Fetching all notes from 'luminar-notes' database...");
  try {
    const notes = await Note.find().sort({ timestamp: -1 });
    console.log(`✅ SUCCESS: Found ${notes.length} notes in 'notes' collection`);
    console.log("📝 Notes data:", notes);
    res.status(200).json(notes);
  } catch (error) {
    console.error("❌ GET ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
export const createNote = async (req, res) => {
  console.log("📩 POST REQUEST: Saving new note to 'luminar-notes' database...");
  console.log("📦 DATA RECEIVED:", req.body);

  const { title, content, date, timestamp } = req.body;

  // Validation
  if (!content || content.trim() === "") {
    console.warn("⚠️ VALIDATION FAILED: Content is empty");
    return res.status(400).json({ message: "Note content cannot be empty" });
  }

  if (!date) {
    console.warn("⚠️ VALIDATION FAILED: Date is missing");
    return res.status(400).json({ message: "Date is required" });
  }

  const newNote = new Note({
    title: title || "Untitled Page",
    content: content,
    date: date,
    timestamp: timestamp || Date.now()
  });

  try {
    const savedNote = await newNote.save();
    console.log("🚀 DB SUCCESS: Note saved to 'notes' collection!");
    console.log("📝 Saved note:", {
      id: savedNote._id,
      title: savedNote.title,
      date: savedNote.date,
      database: 'luminar-notes',
      collection: 'notes'
    });
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("❌ SAVE ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
export const updateNote = async (req, res) => {
  console.log(`📝 PUT REQUEST: Updating note ID: ${req.params.id}`);
  console.log("📦 NEW DATA:", req.body);

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, timestamp: Date.now() }, // Update timestamp on edit
      { new: true, runValidators: true }
    );
    
    if (!updatedNote) {
      console.warn("⚠️ UPDATE FAILED: Note not found in 'notes' collection");
      return res.status(404).json({ message: "Note not found" });
    }

    console.log("✅ UPDATE SUCCESS - Note updated in 'notes' collection");
    console.log("📝 Updated note:", {
      id: updatedNote._id,
      title: updatedNote.title,
      date: updatedNote.date
    });
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("❌ UPDATE ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  console.log(`🗑️ DELETE REQUEST: ID ${req.params.id}`);
  try {
    const result = await Note.findByIdAndDelete(req.params.id);
    if (!result) {
      console.warn("⚠️ DELETE FAILED: Note not found in 'notes' collection");
      return res.status(404).json({ message: "Note not found" });
    }
    console.log("✅ DELETE SUCCESS - Note removed from 'notes' collection");
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
export const getNoteById = async (req, res) => {
  console.log(`🔍 GET REQUEST: Fetching note ID: ${req.params.id}`);
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("❌ GET NOTE ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete all notes (Use with caution!)
// @route   DELETE /api/notes/clear-all
export const deleteAllNotes = async (req, res) => {
  console.log("⚠️ WARNING: Deleting all notes from 'notes' collection...");
  try {
    const result = await Note.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} notes from database`);
    res.status(200).json({ message: `Deleted ${result.deletedCount} notes` });
  } catch (error) {
    console.error("❌ DELETE ALL ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};