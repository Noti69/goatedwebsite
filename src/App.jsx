import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import Hero from './components/Hero';
import Story from './components/Story';
import Gallery from './components/Gallery';
import EditorSidebar from './components/EditorSidebar';
import DynamicCanvas from './components/DynamicCanvas';

function App() {
  const config = useStore((state) => state.config);
  const blocks = useStore((state) => state.blocks);
  const setSelectedBlock = useStore((state) => state.setSelectedBlock);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === 'true') {
      const password = prompt('Enter Editor Password:');
      if (password === 'iloveyou') {
        setIsAuthed(true);
      } else {
        alert('Wrong password! Redirecting to safe view.');
        window.location.search = ''; 
      }
    }
  }, []);

  const isEditMode = isAuthed;

  // THE FIX: Added Array safety and fallback to prevent NaN loops
  let maxBottom = typeof window !== 'undefined' ? window.innerHeight : 1000;
  if (Array.isArray(blocks)) {
    blocks.forEach(b => {
      const bottom = (b.y || 0) + (b.height || 0);
      if (!isNaN(bottom) && bottom > maxBottom) maxBottom = bottom;
    });
  }

  const docHeight = isEditMode ? maxBottom + 1000 : maxBottom;

  return (
    <div 
      className="w-full transition-colors duration-300 relative" 
      style={{ backgroundColor: config.bgColor, color: config.textColor, height: `${docHeight}px` }}
      onClick={() => isEditMode && setSelectedBlock(null)}
    >
      {config.showHero && <div className="relative z-10"><Hero config={config} isEditMode={isEditMode} /></div>}
      {config.showStory && <div className="relative z-10"><Story config={config} isEditMode={isEditMode} /></div>}
      {config.showGallery && <div className="relative z-10"><Gallery config={config} isEditMode={isEditMode} /></div>}

      <DynamicCanvas isEditMode={isEditMode} />

      {isAuthed && (
        <EditorSidebar closeEditor={() => setIsAuthed(false)} />
      )}
    </div>
  );
}

export default App;