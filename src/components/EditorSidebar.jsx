import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useStore } from '../store/useStore';
import { X, Trash2, Type, Image as ImageIcon, Eye, EyeOff, Square, AlignCenterHorizontal, AlignCenterVertical, Palette, Minimize2, Pencil, Eraser, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Download, Upload, Gamepad2, Disc } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function EditorSidebar({ closeEditor }) {
  const config = useStore((state) => state.config);
  const updateConfig = useStore((state) => state.updateConfig);
  
  const blocks = useStore((state) => state.blocks);
  const addBlock = useStore((state) => state.addBlock);
  const removeBlock = useStore((state) => state.removeBlock);
  const updateBlock = useStore((state) => state.updateBlock);
  const selectedBlockId = useStore((state) => state.selectedBlockId);
  const setSelectedBlock = useStore((state) => state.setSelectedBlock);
  const clearDrawing = useStore((state) => state.clearDrawing);
  const updateZIndex = useStore((state) => state.updateZIndex);
  const exportState = useStore((state) => state.exportState);
  const importState = useStore((state) => state.importState);

  const set = (key, value) => updateConfig({ [key]: value });
  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 380, y: 20 });
  const [size, setSize] = useState({ width: 350, height: 600 });

  const centerHorizontally = () => {
    if (!selectedBlock) return;
    const x = (window.innerWidth - selectedBlock.width) / 2;
    updateBlock(selectedBlock.id, { x: Math.max(0, x) });
  };

  const centerVertically = () => {
    if (!selectedBlock) return;
    const y = (window.innerHeight - selectedBlock.height) / 2;
    updateBlock(selectedBlock.id, { y: Math.max(0, y) });
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => importState(event.target.result);
    reader.readAsText(file);
  };

  if (isCollapsed) {
    return (
      <Rnd width={64} height={64} bounds="window" position={{ x: position.x, y: position.y }} onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })} enableResizing={false} className="z-[100]" cancel=".no-drag">
        <div className="w-16 h-16 rounded-full bg-gray-900/60 backdrop-blur-xl shadow-2xl border border-white/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-gray-900/80 transition-colors toolbar-drag-handle">
          <button className="no-drag w-full h-full flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setIsCollapsed(false); }}>
            <Palette size={24} className="text-white drop-shadow-lg pointer-events-none" />
          </button>
        </div>
      </Rnd>
    );
  }

  return (
    <Rnd size={{ width: size.width, height: size.height }} position={{ x: position.x, y: position.y }} bounds="window" onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })} onResizeStop={(e, direction, ref, delta, position) => { setSize({ width: ref.offsetWidth, height: ref.offsetHeight }); setPosition(position); }} minWidth={300} minHeight={400} className="z-[100]" dragHandleClassName="toolbar-drag-handle">
      <div className="w-full h-full bg-gray-900/80 backdrop-blur-xl text-white shadow-2xl border border-white/10 rounded-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        <div className="toolbar-drag-handle flex justify-between items-center p-4 border-b border-white/10 cursor-grab active:cursor-grabbing">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase pointer-events-none">Editor</h2>
          <div className="flex gap-2 z-10">
            <button onClick={() => setIsCollapsed(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Collapse"><Minimize2 size={16} /></button>
            <button onClick={closeEditor} className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors" title="Exit Edit Mode"><X size={16} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* ADD ELEMENTS */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Add Elements</h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => addBlock('text')} className="flex items-center justify-center gap-2 bg-blue-600/90 hover:bg-blue-600 py-2 rounded-lg text-xs font-semibold transition-colors"><Type size={14} /> Text</button>
              <button onClick={() => addBlock('image')} className="flex items-center justify-center gap-2 bg-purple-600/90 hover:bg-purple-600 py-2 rounded-lg text-xs font-semibold transition-colors"><ImageIcon size={14} /> Image</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => addBlock('block')} className="flex items-center justify-center gap-1 bg-pink-600/90 hover:bg-pink-600 py-2 rounded-lg text-xs font-semibold transition-colors"><Square size={14} /> Block</button>
              <button onClick={() => addBlock('draw')} className="flex items-center justify-center gap-1 bg-yellow-600/90 hover:bg-yellow-600 py-2 rounded-lg text-xs font-semibold transition-colors"><Pencil size={14} /> Draw</button>
              <button onClick={() => addBlock('snake')} className="flex items-center justify-center gap-1 bg-green-600/90 hover:bg-green-600 py-2 rounded-lg text-xs font-semibold transition-colors"><Gamepad2 size={14} /> Snake</button>
            </div>
            <button onClick={() => addBlock('vinyl')} className="w-full flex items-center justify-center gap-2 bg-indigo-600/90 hover:bg-indigo-600 py-2 rounded-lg text-xs font-semibold transition-colors"><Disc size={14} /> Vinyl Player</button>
          </div>

          <hr className="border-white/10" />

          {/* EDIT SELECTED */}
          {selectedBlock ? (
            <div className="space-y-3 bg-blue-500/10 p-4 rounded-xl border border-blue-500/30">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase text-blue-300 font-semibold tracking-wider">Edit Selected</h3>
                <button onClick={() => setSelectedBlock(null)} className="text-[10px] text-gray-400 hover:text-white">Deselect</button>
              </div>

              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-blue-500/20">
                <button onClick={centerHorizontally} className="flex items-center justify-center gap-1 bg-gray-700/80 hover:bg-gray-600 py-1.5 rounded-lg text-[10px] font-semibold transition-colors"><AlignCenterHorizontal size={12} /> Center H</button>
                <button onClick={centerVertically} className="flex items-center justify-center gap-1 bg-gray-700/80 hover:bg-gray-600 py-1.5 rounded-lg text-[10px] font-semibold transition-colors"><AlignCenterVertical size={12} /> Center V</button>
              </div>

              <div className="grid grid-cols-4 gap-2 pb-3 border-b border-blue-500/20">
                <button onClick={() => updateZIndex(selectedBlock.id, 'back')} className="flex flex-col items-center justify-center gap-1 bg-gray-700/80 hover:bg-gray-600 py-1.5 rounded-lg text-[9px] font-semibold transition-colors"><ChevronsDown size={14} /> Back</button>
                <button onClick={() => updateZIndex(selectedBlock.id, 'backward')} className="flex flex-col items-center justify-center gap-1 bg-gray-700/80 hover:bg-gray-600 py-1.5 rounded-lg text-[9px] font-semibold transition-colors"><ArrowDown size={14} /> Backward</button>
                <button onClick={() => updateZIndex(selectedBlock.id, 'forward')} className="flex flex-col items-center justify-center gap-1 bg-gray-700/80 hover:bg-gray-600 py-1.5 rounded-lg text-[9px] font-semibold transition-colors"><ArrowUp size={14} /> Forward</button>
                <button onClick={() => updateZIndex(selectedBlock.id, 'front')} className="flex flex-col items-center justify-center gap-1 bg-gray-700/80 hover:bg-gray-600 py-1.5 rounded-lg text-[9px] font-semibold transition-colors"><ChevronsUp size={14} /> Front</button>
              </div>
              
              {selectedBlock.type === 'text' ? (
                <>
                  <textarea value={selectedBlock.content} onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })} rows="2" className="w-full bg-black/30 px-3 py-2 rounded text-sm border border-white/10 focus:border-blue-500 outline-none resize-none"></textarea>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] mb-1 text-gray-400">Font Size</label>
                      <input type="number" value={selectedBlock.fontSize} onChange={(e) => updateBlock(selectedBlock.id, { fontSize: parseInt(e.target.value) })} className="w-full bg-black/30 px-2 py-1 rounded text-xs border border-white/10 outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] mb-1 text-gray-400">Font Family</label>
                      <select value={selectedBlock.font} onChange={(e) => updateBlock(selectedBlock.id, { font: e.target.value })} className="w-full bg-black/30 px-2 py-1 rounded text-xs border border-white/10 outline-none">
                        <option value="sans">Montserrat</option>
                        <option value="serif">Playfair</option>
                        <option value="dancing">Dancing Script</option>
                        <option value="pacifico">Pacifico</option>
                        <option value="lobster">Lobster</option>
                        <option value="cinzel">Cinzel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] mb-1 text-gray-400">Text Color</label>
                      <input type="color" value={selectedBlock.color} onChange={(e) => updateBlock(selectedBlock.id, { color: e.target.value })} className="w-full h-8 rounded cursor-pointer bg-transparent border border-white/10" />
                    </div>
                    <div>
                      <label className="block text-[10px] mb-1 text-gray-400">BG Color</label>
                      <input type="color" value={selectedBlock.bgColor === 'transparent' ? '#ffffff' : selectedBlock.bgColor} onChange={(e) => updateBlock(selectedBlock.id, { bgColor: e.target.value })} className="w-full h-8 rounded cursor-pointer bg-transparent border border-white/10" />
                    </div>
                  </div>
                </>
              ) : selectedBlock.type === 'image' ? (
                <ImageUploader label="Selected Image" currentImage={selectedBlock.src} onUpload={(src, width, height) => updateBlock(selectedBlock.id, { src, width, height })} />
              ) : selectedBlock.type === 'vinyl' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] mb-1 text-gray-400">Vinyl Image Path</label>
                    <input 
                      type="text" 
                      value={selectedBlock.imgSrc} 
                      onChange={(e) => updateBlock(selectedBlock.id, { imgSrc: e.target.value })} 
                      placeholder="media/vinyl-cover.jpg"
                      className="w-full bg-black/30 px-3 py-2 rounded text-xs border border-white/10 outline-none"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Path to image in your /public/media folder.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] mb-1 text-gray-400">Audio File Path (MP3)</label>
                    <input 
                      type="text" 
                      value={selectedBlock.audioSrc} 
                      onChange={(e) => updateBlock(selectedBlock.id, { audioSrc: e.target.value })} 
                      placeholder="media/our-song.mp3"
                      className="w-full bg-black/30 px-3 py-2 rounded text-xs border border-white/10 outline-none"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Path to MP3 in your /public/media folder.</p>
                  </div>
                </div>
              ) : selectedBlock.type === 'draw' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] mb-1 text-gray-400">Vinyl Image (Center Label)</label>
                    <ImageUploader label="Upload Image" currentImage={selectedBlock.imgSrc} onUpload={(val) => updateBlock(selectedBlock.id, { imgSrc: val })} />
                  </div>
                  <div>
                    <label className="block text-[10px] mb-1 text-gray-400">Audio File (MP3)</label>
                    <label className="w-full flex items-center justify-center gap-2 bg-sky-600/80 hover:bg-sky-600 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
                      <Upload size={14} /> Upload MP3
                      <input type="file" accept="audio/mpeg, audio/mp3" onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => updateBlock(selectedBlock.id, { audioSrc: ev.target.result });
                        reader.readAsDataURL(file);
                      }} className="hidden" />
                    </label>
                    {selectedBlock.audioSrc && <p className="text-[10px] text-green-400 text-center mt-1">MP3 Loaded!</p>}
                  </div>
                </div>
              ) : selectedBlock.type === 'draw' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] mb-1 text-gray-400">Brush Color</label>
                      <input type="color" value={selectedBlock.brushColor} onChange={(e) => updateBlock(selectedBlock.id, { brushColor: e.target.value })} className="w-full h-8 rounded cursor-pointer bg-transparent border border-white/10" />
                    </div>
                    <div>
                      <label className="block text-[10px] mb-1 text-gray-400">Brush Size</label>
                      <input type="number" value={selectedBlock.brushSize} onChange={(e) => updateBlock(selectedBlock.id, { brushSize: parseInt(e.target.value) })} className="w-full bg-black/30 px-2 py-1 rounded text-xs border border-white/10 outline-none" />
                    </div>
                  </div>
                  <button onClick={() => clearDrawing(selectedBlock.id)} className="w-full flex items-center justify-center gap-2 bg-gray-600/80 hover:bg-gray-500 py-2 rounded-lg text-xs font-semibold transition-colors"><Eraser size={14} /> Clear Canvas</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] mb-1 text-gray-400">Block Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={selectedBlock.bgColor} onChange={(e) => updateBlock(selectedBlock.id, { bgColor: e.target.value })} className="w-12 h-8 rounded cursor-pointer bg-transparent border-none" />
                      <input type="text" value={selectedBlock.bgColor} onChange={(e) => updateBlock(selectedBlock.id, { bgColor: e.target.value })} className="flex-1 bg-black/30 px-3 py-2 rounded text-xs border border-white/10 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] mb-1 text-gray-400">Corner Radius</label>
                    <input type="number" value={selectedBlock.borderRadius} onChange={(e) => updateBlock(selectedBlock.id, { borderRadius: parseInt(e.target.value) })} className="w-full bg-black/30 px-2 py-1 rounded text-xs border border-white/10 outline-none" />
                  </div>
                </div>
              )}

              <button onClick={() => removeBlock(selectedBlock.id)} className="w-full flex items-center justify-center gap-2 bg-red-600/80 hover:bg-red-600 py-2 rounded-lg text-xs font-semibold transition-colors mt-2"><Trash2 size={14} /> Delete</button>
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 text-center italic">Click an element to edit it, or add a new one above.</p>
          )}

          <hr className="border-white/10" />

          {/* BUILT-IN SECTIONS */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Built-in Sections</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => set('showHero', !config.showHero)} className="flex items-center justify-between p-2 bg-black/20 rounded-lg text-xs hover:bg-black/40 transition-colors">Hero Section {config.showHero ? <Eye size={14} /> : <EyeOff size={14} />}</button>
              <button onClick={() => set('showStory', !config.showStory)} className="flex items-center justify-between p-2 bg-black/20 rounded-lg text-xs hover:bg-black/40 transition-colors">Story Section {config.showStory ? <Eye size={14} /> : <EyeOff size={14} />}</button>
              <button onClick={() => set('showGallery', !config.showGallery)} className="flex items-center justify-between p-2 bg-black/20 rounded-lg text-xs hover:bg-black/40 transition-colors">Gallery Section {config.showGallery ? <Eye size={14} /> : <EyeOff size={14} />}</button>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* GLOBAL THEME */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Global Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              <div><label className="block text-[10px] mb-1 text-gray-400">BG</label><input type="color" value={config.bgColor} onChange={(e) => set('bgColor', e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border border-white/10" /></div>
              <div><label className="block text-[10px] mb-1 text-gray-400">Text</label><input type="color" value={config.textColor} onChange={(e) => set('textColor', e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border border-white/10" /></div>
              <div><label className="block text-[10px] mb-1 text-gray-400">Accent</label><input type="color" value={config.accentColor} onChange={(e) => set('accentColor', e.target.value)} className="w-full h-8 rounded cursor-pointer bg-transparent border border-white/10" /></div>
            </div>
          </div>

          <hr className="border-white/10" />

          {/* BACKUP & RESTORE */}
          <div className="space-y-2 pb-4">
            <h3 className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Backup & Restore</h3>
            <button onClick={exportState} className="w-full flex items-center justify-center gap-2 bg-emerald-600/80 hover:bg-emerald-600 py-2 rounded-lg text-xs font-semibold transition-colors">
              <Download size={14} /> Export Blueprint
            </button>
            <label className="w-full flex items-center justify-center gap-2 bg-sky-600/80 hover:bg-sky-600 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer">
              <Upload size={14} /> Import Blueprint
              <input type="file" accept="application/json" onChange={handleImport} className="hidden" />
            </label>
          </div>

        </div>
      </div>
    </Rnd>
  );
}