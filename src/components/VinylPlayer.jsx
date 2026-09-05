import { useRef, useState } from 'react';

export default function VinylPlayer({ block, isEditMode, isSelected }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // This ensures the path works perfectly both on localhost AND GitHub Pages!
  const baseUrl = import.meta.env.BASE_URL;
  const audioPath = block.audioSrc ? `${baseUrl}${block.audioSrc}` : '';
  const imagePath = block.imgSrc ? `${baseUrl}${block.imgSrc}` : '';

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isEditMode && !isSelected) return;
    if (!block.audioSrc) return alert("Enter the path to your MP3 in the editor!");
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-transparent" style={{ pointerEvents: isEditMode && !isSelected ? 'none' : 'auto' }}>
      <div 
        className={`vinyl-disc vinyl-play-btn w-full h-full flex items-center justify-center ${isPlaying ? 'vinyl-spin' : ''}`} 
        onClick={togglePlay}
      >
        {/* Center Label with Image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] rounded-full overflow-hidden border-4 border-black shadow-lg z-10 pointer-events-none">
          {imagePath ? (
            <img src={imagePath} className="w-full h-full object-cover" alt="vinyl label" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white text-[10px] text-center p-1">Enter Image Path</div>
          )}
        </div>
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[8%] h-[8%] bg-gray-900 rounded-full z-20 border border-gray-600 pointer-events-none"></div>
      </div>
      <audio ref={audioRef} src={audioPath} loop onEnded={() => setIsPlaying(false)} />
    </div>
  );
}