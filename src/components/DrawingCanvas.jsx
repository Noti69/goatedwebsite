import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

export default function DrawingCanvas({ block, isEditMode, isSelected }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const currentPath = useRef([]);
  const saveDrawPath = useStore((state) => state.saveDrawPath);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = block.width || 400;
    canvas.height = block.height || 300;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // THE FIX: Added optional chaining (?.) so it won't crash if paths is missing
    block.paths?.forEach(path => {
      if (!path.points || path.points.length === 0) return;
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);
      ctx.lineWidth = path.size;
      ctx.strokeStyle = path.color;
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    redraw();
  }, [block.paths, block.width, block.height]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDrawing = (e) => {
    if (!isEditMode || !isSelected) return;
    e.stopPropagation();
    isDrawing.current = true;
    const { x, y } = getCoords(e);
    currentPath.current = [{ x, y }];
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = block.brushSize;
    ctx.strokeStyle = block.brushColor;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    e.stopPropagation();
    const { x, y } = getCoords(e);
    currentPath.current.push({ x, y });
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing.current) return;
    e.stopPropagation();
    isDrawing.current = false;
    saveDrawPath(block.id, currentPath.current);
    currentPath.current = [];
  };

  return (
    <canvas
      ref={canvasRef}
      className="draw-surface w-full h-full"
      style={{ 
        cursor: isSelected && isEditMode ? 'crosshair' : 'default',
        pointerEvents: isSelected && isEditMode ? 'auto' : 'none',
        backgroundColor: 'transparent'
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
}