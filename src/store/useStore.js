import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(persist(
  (set, get) => ({
    config: {
      bgColor: '#ffffff', textColor: '#111111', accentColor: '#3b82f6', fontFamily: 'sans',
      title: '', subtitle: '', heroImage: '', storyTitle: '', storyText: '',
      galleryImage1: '', galleryImage2: '', galleryImage3: '',
      showHero: false, showStory: false, showGallery: false,
    },
    blocks: [], 
    selectedBlockId: null,

    updateConfig: (newConfig) => set((state) => ({ config: { ...state.config, ...newConfig } })),
    
    addBlock: (type) => set((state) => {
      if (!Array.isArray(state.blocks)) return state;
      const id = Date.now().toString();
      const maxZ = state.blocks.length > 0 ? Math.max(...state.blocks.map(b => b.zIndex || 0)) : 0;
      let newBlock;
      if (type === 'text') {
        newBlock = { id, type: 'text', content: 'New Text', x: 100, y: 100, width: 250, height: 80, fontSize: 32, color: '#111111', bgColor: 'transparent', font: 'sans', zIndex: maxZ + 1 };
      } else if (type === 'image') {
        newBlock = { id, type: 'image', src: '', x: 100, y: 200, width: 300, height: 200, zIndex: maxZ + 1 };
      } else if (type === 'block') {
        newBlock = { id, type: 'block', x: 100, y: 400, width: 800, height: 400, bgColor: '#e5e7eb', borderRadius: 16, zIndex: maxZ + 1 };
      } else if (type === 'draw') {
        newBlock = { id, type: 'draw', x: 100, y: 300, width: 400, height: 300, brushColor: '#000000', brushSize: 4, paths: [], zIndex: maxZ + 1 };
      } else if (type === 'snake') {
        newBlock = { id, type: 'snake', x: 150, y: 150, width: 400, height: 400, zIndex: maxZ + 1 };
      }
      return { blocks: [...state.blocks, newBlock], selectedBlockId: id };
    }),
    
    updateBlock: (id, updates) => set((state) => {
      if (!Array.isArray(state.blocks)) return state;
      return { blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b) };
    }),
    
    removeBlock: (id) => set((state) => {
      if (!Array.isArray(state.blocks)) return state;
      return { blocks: state.blocks.filter(b => b.id !== id), selectedBlockId: null };
    }),

    saveDrawPath: (id, path) => set((state) => {
      if (!Array.isArray(state.blocks)) return state;
      return { blocks: state.blocks.map(b => b.id === id ? { ...b, paths: [...(b.paths || []), { points: path, color: b.brushColor, size: b.brushSize }] } : b) };
    }),

    clearDrawing: (id) => set((state) => {
      if (!Array.isArray(state.blocks)) return state;
      return { blocks: state.blocks.map(b => b.id === id ? { ...b, paths: [] } : b) };
    }),

    updateZIndex: (id, action) => set((state) => {
      if (!Array.isArray(state.blocks)) return state;
      const blocks = [...state.blocks];
      const currentBlock = blocks.find(b => b.id === id);
      if (!currentBlock) return state;

      const sorted = [...blocks].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      const index = sorted.findIndex(b => b.id === id);

      if (action === 'front') {
        const maxZ = Math.max(...blocks.map(b => b.zIndex || 0));
        return { blocks: blocks.map(b => b.id === id ? { ...b, zIndex: maxZ + 1 } : b) };
      } else if (action === 'back') {
        const minZ = Math.min(...blocks.map(b => b.zIndex || 0));
        return { blocks: blocks.map(b => b.id === id ? { ...b, zIndex: minZ - 1 } : b) };
      } else if (action === 'forward' && index < sorted.length - 1) {
        const nextBlock = sorted[index + 1];
        return {
          blocks: blocks.map(b => {
            if (b.id === id) return { ...b, zIndex: nextBlock.zIndex || 0 };
            if (b.id === nextBlock.id) return { ...b, zIndex: currentBlock.zIndex || 0 };
            return b;
          })
        };
      } else if (action === 'backward' && index > 0) {
        const prevBlock = sorted[index - 1];
        return {
          blocks: blocks.map(b => {
            if (b.id === id) return { ...b, zIndex: prevBlock.zIndex || 0 };
            if (b.id === prevBlock.id) return { ...b, zIndex: currentBlock.zIndex || 0 };
            return b;
          })
        };
      }
      return state;
    }),
    
    setSelectedBlock: (id) => set({ selectedBlockId: id }),

    exportState: () => {
      const state = get();
      const dataStr = JSON.stringify(state);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "my-website-backup.json";
      a.click();
    },

    importState: (jsonString) => {
      try {
        const parsed = JSON.parse(jsonString);
        set({
          config: parsed.config || get().config,
          blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
          selectedBlockId: null
        });
      } catch (e) {
        alert("Invalid backup file selected.");
      }
    }
  }),
  { name: 'gift-website-storage-v2' }
));