import { motion } from 'framer-motion';

export default function Gallery({ config, isEditMode }) {
  const images = [config.galleryImage1, config.galleryImage2, config.galleryImage3];

  return (
    <section className="py-24 md:py-32 px-6 bg-black/5">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          drag={isEditMode} 
          dragMomentum={false} 
          className={`text-4xl md:text-6xl font-bold mb-12 text-center ${isEditMode ? 'cursor-grab active:cursor-grabbing border-2 border-dashed border-gray-400 p-2 inline-block w-full' : ''}`} 
          style={{ color: config.accentColor, fontFamily: config.fontFamily === 'serif' ? "'Playfair Display', serif" : "'Inter', sans-serif" }}
        >
          Moments
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <motion.div 
              key={index} 
              drag={isEditMode} 
              dragMomentum={false} 
              className={`relative overflow-hidden rounded-2xl shadow-xl group aspect-[4/5] ${isEditMode ? 'cursor-grab active:cursor-grabbing border-4 border-blue-500' : ''}`}
            >
              <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}