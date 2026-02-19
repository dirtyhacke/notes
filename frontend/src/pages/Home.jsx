import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You'll need to install axios: npm install axios

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // API base URL - adjust this to match your backend URL
  const API_URL = 'http://localhost:5000/api/notes'; // Change port if needed

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load notes from API on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSave = async () => {
    if (!currentNote.content.trim() && !currentNote.title.trim()) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const noteTitle = currentNote.title || "Untitled Page";
    const noteData = {
      title: noteTitle,
      content: currentNote.content,
      date: formattedDate,
      timestamp: now.getTime()
    };

    try {
      if (currentNote.id) {
        // Update existing note
        const response = await axios.put(`${API_URL}/${currentNote.id}`, noteData);
        const updatedNotes = notes.map(n => 
          n._id === currentNote.id ? response.data : n
        );
        setNotes(updatedNotes);
      } else {
        // Create new note
        const response = await axios.post(API_URL, noteData);
        setNotes([response.data, ...notes]);
        setCurrentNote(response.data); // Set current note to the newly created one
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const startNewNote = () => {
    setCurrentNote({ id: null, title: '', content: '' });
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes(notes.filter(note => note._id !== id));
      if (currentNote.id === id) {
        startNewNote();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100 font-serif">
      
      {/* Sidebar */}
      <div className="w-72 bg-stone-900 text-stone-300 flex flex-col border-r border-stone-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white tracking-tight text-center">Luminar Notes</h2>
          <button 
            onClick={startNewNote}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg active:scale-95"
          >
            + New Page
          </button>
        </div>
        
        {/* Scrollable History */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-stone-500 font-sans mb-2 px-2">History</p>
          {notes.map((note) => (
            <div 
              key={note._id}
              className="group relative"
            >
              <div 
                onClick={() => setCurrentNote({ 
                  id: note._id, 
                  title: note.title, 
                  content: note.content 
                })}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  currentNote.id === note._id 
                  ? 'bg-stone-800 border-stone-600 text-white shadow-inner' 
                  : 'border-transparent hover:bg-stone-800/50 hover:text-stone-100'
                }`}
              >
                <p className="truncate text-sm font-semibold">{note.title}</p>
                <span className="text-[10px] opacity-40 font-sans block mt-1">{note.date}</span>
              </div>
              <button
                onClick={() => deleteNote(note._id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* LIVE CLOCK SECTION */}
        <div className="p-6 bg-black/20 border-t border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="font-sans">
              <p className="text-white text-xl font-light tracking-widest leading-none">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-[10px] text-stone-500 uppercase mt-1">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Notebook Area */}
      <div className="flex-1 flex flex-col h-full bg-stone-200">
        <div className="flex-1 flex flex-col bg-white shadow-inner mx-0 md:mx-4 my-0 md:my-4 rounded-none md:rounded-xl overflow-hidden border border-stone-300">
          
          <div className="flex justify-between items-center px-12 py-6 border-b border-stone-200 bg-stone-50/50">
            <div className="flex-1 mr-4">
              <input 
                className="text-3xl font-bold italic text-stone-700 outline-none w-full bg-transparent placeholder-stone-300"
                placeholder="Title..."
                value={currentNote.title}
                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              />
              {currentNote.date && <p className="text-[10px] text-stone-400 font-sans mt-1 uppercase tracking-wider italic">Last Edited: {currentNote.date}</p>}
            </div>
            <button 
              onClick={handleSave}
              className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-emerald-700 transition shadow-md active:shadow-none"
            >
              Save Note
            </button>
          </div>

          <div className="relative flex-1 overflow-hidden flex flex-col">
            <div className="absolute left-16 top-0 bottom-0 w-[1px] bg-red-300 z-10"></div>
            <div className="absolute left-[65px] top-0 bottom-0 w-[1px] bg-red-300 z-10 opacity-30"></div>

            <textarea
              className="flex-1 w-full p-20 pt-10 text-xl text-stone-800 leading-[2.5rem] outline-none resize-none bg-transparent z-20 overflow-y-auto"
              style={{
                backgroundImage: 'linear-gradient(transparent 98%, #e5e7eb 2%)',
                backgroundSize: '100% 2.5rem',
                backgroundAttachment: 'local'
              }}
              placeholder="Begin writing..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;