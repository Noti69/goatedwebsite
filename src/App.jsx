import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import Hero from './components/Hero';
import Story from './components/Story';
import Gallery from './components/Gallery';
import EditorSidebar from './components/EditorSidebar';
import DynamicCanvas from './components/DynamicCanvas';

// We lock the design to a standard 1920px wide canvas
const DESIGN_WIDTH = 1920;

function App() {
  const config = useStore((state) => state.config);
  const blocks = useStore((state) => state.blocks);
  const setSelectedBlock = useStore((state) => state.setSelectedBlock);
  const [isAuthed, setIsAuthed] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    document.body.style.backgroundColor = config.bgColor;
  }, [config.bgColor]);

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

  // SCALER LOGIC: Calculate how much to shrink the site to fit the screen
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // If screen is smaller than our design, scale it down. Otherwise, leave it at 100%
      const newScale = currentWidth < DESIGN_WIDTH ? currentWidth / DESIGN_WIDTH : 1;
      setScale(newScale);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isEditMode = isAuthed;
  
  // In Edit Mode, we don't scale, so you can still edit 1:1
  const currentScale = isEditMode ? 1 : scale;

  let maxBottom = typeof window !== 'undefined' ? window.innerHeight : 1000;
  if (Array.isArray(blocks)) {
    blocks.forEach(b => {
      const bottom = (b.y || 0) + (b.height || 0);
      if (!isNaN(bottom) && bottom > maxBottom) maxBottom = bottom;
    });
  }

  const docHeight = isEditMode ? maxBottom + 1000 : maxBottom;
  // We must multiply the height by the scale so the bottom of the page doesn't have a massive gap
  const scaledDocHeight = docHeight * currentScale;

  return (
    <div 
      className={`w-full transition-colors duration-300 relative ${!isEditMode ? 'overflow-hidden' : ''}`} 
      style={{ backgroundColor: config.bgColor, color: config.textColor, height: `${scaledDocHeight}px` }}
      onClick={() => isEditMode && setSelectedBlock(null)}
    >
      {/* THE SCALER WRAPPER */}
      <div style={{ width: `${DESIGN_WIDTH}px`, transform: `scale(${currentScale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
        
        {config.showHero && <div className="relative z-10"><Hero config={config} isEditMode={isEditMode} /></div>}
        {config.showStory && <div className="relative z-10"><Story config={config} isEditMode={isEditMode} /></div>}
        {config.showGallery && <div className="relative z-10"><Gallery config={config} isEditMode={isEditMode} /></div>}

        <DynamicCanvas isEditMode={isEditMode} />

      </div>

      {isAuthed && (
        <EditorSidebar closeEditor={() => setIsAuthed(false)} />
      )}
    </div>
  );
}

export default App;