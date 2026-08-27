import { useRef, useEffect, useState, useCallback } from 'react';

export default function SnakeGame({ block, isEditMode, isSelected }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const dirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 15, y: 15 });
  const loopRef = useRef(null);

  const GRID_SIZE = 20; // 20x20 grid

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cellSize = canvas.width / GRID_SIZE;

    // Background
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(foodRef.current.x * cellSize + cellSize/2, foodRef.current.y * cellSize + cellSize/2, cellSize/2.5, 0, Math.PI * 2);
    ctx.fill();

    // Snake
    snakeRef.current.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? '#34d399' : '#10b981';
      ctx.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize - 1, cellSize - 1);
    });
  }, []);

  const tick = useCallback(() => {
    let newSnake = [...snakeRef.current];
    let head = { ...newSnake[0] };
    head.x += dirRef.current.x;
    head.y += dirRef.current.y;

    // Wall Collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return endGame();
    }
    // Self Collision
    if (newSnake.some(s => s.x === head.x && s.y === head.y)) {
      return endGame();
    }

    newSnake.unshift(head);

    // Food Collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(s => s + 10);
      let newFood;
      do {
        newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      } while (newSnake.some(s => s.x === newFood.x && s.y === newFood.y));
      foodRef.current = newFood;
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw]);

  const endGame = () => {
    clearInterval(loopRef.current);
    setIsPlaying(false);
    setGameOver(true);
  };

  const startGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    foodRef.current = { x: 15, y: 15 };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Game Loop
  useEffect(() => {
    if (isPlaying) {
      loopRef.current = setInterval(tick, 120);
      return () => clearInterval(loopRef.current);
    }
  }, [isPlaying, tick]);

  // Draw initial state
  useEffect(() => {
    draw();
  }, [draw]);

  // Keyboard controls (only if selected to avoid hijacking editor)
  useEffect(() => {
    const handleKey = (e) => {
      if (!isPlaying) return;
      const k = e.key;
      if (k === 'ArrowUp' && dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 };
      else if (k === 'ArrowDown' && dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 };
      else if (k === 'ArrowLeft' && dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 };
      else if (k === 'ArrowRight' && dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 };
      
      // Prevent scrolling when playing
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k)) e.preventDefault();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  const handleDirButton = (dx, dy) => {
    if (!isPlaying) return;
    if (dx === 0 && dirRef.current.y === 0) dirRef.current = { x: 0, y: dy };
    if (dy === 0 && dirRef.current.x === 0) dirRef.current = { x: dx, y: 0 };
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 select-none" style={{ pointerEvents: isEditMode && !isSelected ? 'none' : 'auto' }}>
      <div className="text-white text-xs mb-1 flex justify-between w-full px-2">
        <span>Score: {score}</span>
        <span>{isPlaying ? 'Playing...' : 'Paused'}</span>
      </div>
      <div className="relative w-full h-full" style={{ aspectRatio: '1 / 1' }}>
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="w-full h-full snake-canvas rounded-md" 
        />
        
        {/* Overlays */}
        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white rounded-md cursor-pointer" onClick={startGame}>
            {gameOver ? (
              <>
                <p className="text-xl font-bold text-red-500 mb-1">Game Over!</p>
                <p className="text-sm mb-2">Score: {score}</p>
                <button className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm font-bold">Play Again</button>
              </>
            ) : (
              <button className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded text-sm font-bold">Click to Play</button>
            )}
          </div>
        )}
      </div>

      {/* Mobile D-Pad */}
      {isPlaying && (
        <div className="grid grid-cols-3 gap-1 mt-2 md:hidden">
          <div></div>
          <button onTouchStart={() => handleDirButton(0, -1)} className="bg-gray-700 text-white p-2 rounded text-xs">▲</button>
          <div></div>
          <button onTouchStart={() => handleDirButton(-1, 0)} className="bg-gray-700 text-white p-2 rounded text-xs">◀</button>
          <button onTouchStart={() => handleDirButton(0, 1)} className="bg-gray-700 text-white p-2 rounded text-xs">▼</button>
          <button onTouchStart={() => handleDirButton(1, 0)} className="bg-gray-700 text-white p-2 rounded text-xs">▶</button>
        </div>
      )}
    </div>
  );
}