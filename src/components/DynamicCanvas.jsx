import { Rnd } from 'react-rnd';
import { useStore } from '../store/useStore';
import DrawingCanvas from './DrawingCanvas';
import SnakeGame from './SnakeGame'; // NEW

export default function DynamicCanvas({ isEditMode }) {
  const blocks = useStore((state) => state.blocks);
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const setSelectedBlock = useStore((state) => state.setSelectedBlock);
  const updateBlock = useStore((state) => state.updateBlock);

  const fontFamilies = {
    sans: "'Montserrat', sans-serif", serif: "'Playfair Display', serif",
    dancing: "'Dancing Script', cursive", pacifico: "'Pacifico', cursive",
    lobster: "'Lobster', cursive", cinzel: "'Cinzel', serif",
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {blocks.map(block => {
        const isSelected = selectedBlockId === block.id;

        return (
          <Rnd
            key={block.id}
            size={{ width: block.width, height: block.height }}
            position={{ x: block.x, y: block.y }}
            disableDragging={!isEditMode}
            enableResizing={isEditMode}
            bounds="parent"
            onDragStart={() => isEditMode && setSelectedBlock(block.id)}
            onDragStop={(e, d) => {
              let finalX = d.x; let finalY = d.y;
              const snapThreshold = 20;
              const sidebarWidth = 350;
              const visibleWidth = window.innerWidth - sidebarWidth;
              const blockCenterX = d.x + (block.width / 2);
              const viewportCenterX = visibleWidth / 2;
              if (Math.abs(blockCenterX - viewportCenterX) < snapThreshold) {
                finalX = viewportCenterX - (block.width / 2);
              }
              const blockCenterY = d.y + (block.height / 2);
              const viewportCenterY = window.innerHeight / 2;
              if (Math.abs(blockCenterY - viewportCenterY) < snapThreshold) {
                finalY = viewportCenterY - (block.height / 2);
              }
              updateBlock(block.id, { x: finalX, y: finalY });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateBlock(block.id, { width: ref.offsetWidth, height: ref.offsetHeight, ...position });
            }}
            // Prevent dragging when interacting with the game canvas
            cancel=".draw-surface, .snake-canvas"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (isEditMode) setSelectedBlock(block.id);
            }}
            className={`pointer-events-auto ${isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
            style={{ 
              zIndex: isSelected ? 9999 : (block.zIndex || 10), 
              outline: isEditMode ? (isSelected ? '2px solid #3b82f6' : '2px dashed rgba(150, 150, 150, 0.5)') : 'none', 
              outlineOffset: '2px' 
            }}
          >
            {block.type === 'text' ? (
              <p 
                style={{ 
                  fontSize: `${block.fontSize}px`, color: block.color, 
                  backgroundColor: block.bgColor === 'transparent' ? 'transparent' : block.bgColor,
                  padding: '8px', fontFamily: fontFamilies[block.font], width: '100%', height: '100%',
                  margin: 0, whiteSpace: 'pre-wrap', overflow: 'hidden', boxSizing: 'border-box',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none'
                }}
              >
                {block.content}
              </p>
            ) : block.type === 'image' ? (
              <img src={block.src} alt="Custom" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
            ) : block.type === 'draw' ? (
              <DrawingCanvas block={block} isEditMode={isEditMode} isSelected={isSelected} />
            ) : block.type === 'snake' ? (
              // NEW: Render Snake Game
              <SnakeGame block={block} isEditMode={isEditMode} isSelected={isSelected} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: block.bgColor, borderRadius: `${block.borderRadius}px`, pointerEvents: 'none' }} />
            )}
          </Rnd>
        );
      })}
    </div>
  );
}