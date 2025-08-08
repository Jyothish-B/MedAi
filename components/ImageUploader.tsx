import React, { useState, useRef, useCallback } from 'react';
import { UploadCloudIcon, CameraIcon, XCircleIcon } from './Icons';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        onImageChange(file);
      }
    }
  }, [onImageChange]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  const handleClearImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setImagePreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files)}
      />
      {imagePreview ? (
        <>
          <img src={imagePreview} alt="Prescription preview" className="mx-auto max-h-48 rounded-md" />
          <button
            onClick={handleClearImage}
            className="absolute top-2 right-2 p-1 bg-white/70 rounded-full text-slate-600 hover:bg-white hover:text-red-500 transition-colors"
            aria-label="Remove image"
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-500">
          <UploadCloudIcon className="w-12 h-12 mb-2" />
          <p className="font-semibold">Click to upload or drag and drop</p>
          <p className="text-sm">PNG, JPG, or GIF</p>
          <span className="my-2 text-xs text-slate-400">OR</span>
          <div className="flex items-center gap-2">
            <CameraIcon className="w-4 h-4" />
            <p className="text-sm font-semibold">Use Camera</p>
          </div>
        </div>
      )}
    </div>
  );
};
