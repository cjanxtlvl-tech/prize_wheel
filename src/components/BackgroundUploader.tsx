import React, { useRef } from 'react';

interface BackgroundUploaderProps {
  onBackgroundUpload: (dataUrl: string) => void;
  onBackgroundClear?: () => void;
  hasBackground?: boolean;
}

export const BackgroundUploader: React.FC<BackgroundUploaderProps> = ({
  onBackgroundUpload,
  onBackgroundClear,
  hasBackground = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 2MB for backgrounds)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onBackgroundUpload(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-medium text-gray-700">
        Wheel Background Image
      </label>

      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          {hasBackground ? 'Change Background' : 'Upload Background'}
        </button>

        {hasBackground && onBackgroundClear && (
          <button
            onClick={onBackgroundClear}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
          >
            Clear Background
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Max file size: 2MB. Supported: JPG, PNG, GIF, WebP
      </p>
    </div>
  );
};
