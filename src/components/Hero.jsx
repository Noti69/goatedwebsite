import { motion } from 'framer-motion';

export default function Hero({ config, isEditMode }) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={config.heroImage} alt="Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 text-center px-6">
        {/* The drag prop is what makes it movable! */}
        <motion.h1 
          drag={isEditMode} 
          dragMomentum={false} 
          className={`text-5xl md:text-8xl font-bold mb-6 text-white drop-shadow-lg ${isEditMode ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-white/50 p-2' : ''}`} 
          style={{ fontFamily: config.fontFamily === 'serif' ? "'Playfair Display', serif" : "'Inter', sans-serif" }}
        >
          {config.title}
        </motion.h1>
        
        <motion.p 
          drag={isEditMode} 
          dragMomentum={false} 
          className={`text-lg md:text-2xl max-w-2xl mx-auto text-white/90 ${isEditMode ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-white/50 p-2' : ''}`}
        >
          {config.subtitle}
        </motion.p>
      </div>
    </section>
  );
}