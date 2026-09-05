import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase';

export default function SharedNote({ block, isEditMode, isSelected }) {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Listen to the cloud for changes (so when she types, you see it instantly)
  useEffect(() => {
    const noteRef = ref(db, `notes/${block.noteId}`);
    const unsub = onValue(noteRef, (snapshot) => {
      const data = snapshot.val();
      setText(data || "");
    });
    return () => unsub();
  }, [block.noteId]);

  // Debounce saving so it doesn't spam the cloud on every single keystroke
  useEffect(() => {
    if (text === undefined) return;
    setIsSaving(true);
    const timer = setTimeout(() => {
      set(ref(db, `notes/${block.noteId}`), text).then(() => {
        setIsSaving(false);
      });
    }, 600);
    return () => clearTimeout(timer);
  }, [text, block.noteId]);

  const handleChange = (e) => {
    e.stopPropagation();
    setText(e.target.value);
  };

  return (
    <div 
      className="shared-note w-full h-full bg-yellow-100 p-4 flex flex-col rounded-md shadow-lg" 
      style={{ pointerEvents: isEditMode && !isSelected ? 'none' : 'auto' }}
    >
      <div className="flex justify-between items-center mb-2 border-b border-yellow-200 pb-1">
        <span className="text-xs font-bold text-yellow-800">Our Notes 📝</span>
        <span className="text-[10px] text-yellow-700 italic">{isSaving ? "Saving..." : "Synced!"}</span>
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        onMouseDown={(e) => e.stopPropagation()}
        className="shared-note-textarea w-full flex-1 bg-transparent border-none outline-none resize-none text-yellow-900 text-sm font-sans"
        placeholder="Type a sweet message to each other..."
        style={{ pointerEvents: 'auto', cursor: 'text' }}
      />
    </div>
  );
}