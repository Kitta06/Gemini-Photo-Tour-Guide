
import React, { useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        onClick={handleClick}
        className={`w-full max-w-2xl p-8 sm:p-12 border-4 border-dashed rounded-2xl transition-colors ${
          disabled
            ? 'border-gray-600 bg-gray-800 cursor-not-allowed'
            : 'border-gray-500 hover:border-blue-400 hover:bg-gray-800 cursor-pointer'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg"
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center text-center">
          <UploadIcon />
          <p className="mt-4 text-xl font-semibold text-gray-200">
            Click to upload or drag and drop
          </p>
          <p className="mt-1 text-sm text-gray-400">
            PNG or JPG
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
