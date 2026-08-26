import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

export default function ImageUploader({ label, currentImage, onUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        // Pass actual dimensions back to the store
        onUpload(compressedDataUrl, width, height);
      };
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] } 
  });

  return (
    <div className="mb-4">
      <label className="block text-sm mb-2 text-gray-300">{label}</label>
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}`}
      >
        <input {...getInputProps()} />
        {currentImage ? (
          <div className="flex flex-col items-center gap-2">
            <img src={currentImage} alt="Preview" className="w-full h-24 object-contain rounded-md bg-black/20" />
            <p className="text-xs text-gray-400">Click or drop to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-4">
            <UploadCloud size={24} className="text-gray-400" />
            <p className="text-xs text-gray-400">Drop image here, or click to select</p>
          </div>
        )}
      </div>
    </div>
  );
}