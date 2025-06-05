// src/components/features/ai-testing/ImageUploader.tsx
"use client";

import React, { useState, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react'; // Supposant que vous utilisez lucide-react pour les icônes

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  clearFile: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, selectedFile, clearFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(event.dataTransfer.files[0].type)) {
        onFileSelect(event.dataTransfer.files[0]);
      } else {
        alert('Veuillez sélectionner un fichier image (png, jpg, jpeg).');
      }
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  if (selectedFile) {
    return (
      <div className="p-4 border rounded-md shadow-sm bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileIcon className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">
              {selectedFile.name}
            </span>
          </div>
          <button
            onClick={clearFile}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Clear file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Aperçu"
          className="mt-3 rounded-md object-contain max-h-48 w-full"
        />
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer
                  ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
                  bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
    >
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <UploadCloud className={`h-12 w-12 mb-3 ${isDragging ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'}`} />
        <p className={`text-sm ${isDragging ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
          <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
      </label>
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        accept="image/png, image/jpeg, image/jpg"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;