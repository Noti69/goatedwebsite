import { motion } from 'framer-motion';

export default function Story({ config, isEditMode }) {
  return (
    <section className="py-24 md:py-32 px-6 transition-colors duration-300" style={{ backgroundColor: config.bgColor }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2 
          drag={isEditMode} 
          dragMomentum={false} 
          className={`text-4xl md:text-6xl font-bold mb-8 ${isEditMode ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-gray-300 p-2 inline-block' : ''}`} 
          style={{ color: config.accentColor, fontFamily: config.fontFamily === 'serif' ? "'Playfair Display', serif" : "'Inter', sans-serif" }}
        >
          {config.storyTitle}
        </motion.h2>
        <motion.p 
          drag={isEditMode} 
          dragMomentum={false} 
          className={`text-lg md:text-2xl leading-relaxed opacity-80 ${isEditMode ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-gray-300 p-2' : ''}`} 
          style={{ color: config.textColor }}
        >
          {config.storyText}
        </motion.p>
      </div>
    </section>
  );
}