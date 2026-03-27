import React from 'react';

interface HeaderBrandProps {
  title: string;
  subtitle?: string;
  logoDataUrl?: string | null;
  onEditClick?: () => void;
  isEditing?: boolean;
}

export const HeaderBrand: React.FC<HeaderBrandProps> = ({
  title,
  subtitle,
  logoDataUrl,
  onEditClick,
  isEditing = false,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg">
      {/* Logo */}
      {logoDataUrl && (
        <div className="w-full flex justify-center">
          <img
            src={logoDataUrl}
            alt="Brand Logo"
            className="max-w-[200px] max-h-[120px] object-contain"
          />
        </div>
      )}

      {/* Title */}
      {title && (
        <h1 className="text-3xl font-bold text-center">{title}</h1>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-gray-300 text-center">{subtitle}</p>
      )}

      {/* Edit button */}
      {onEditClick && (
        <button
          onClick={onEditClick}
          className={`text-sm px-3 py-1 rounded transition-colors ${
            isEditing
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          {isEditing ? 'Done Editing' : 'Sponsored by'}
        </button>
      )}
    </div>
  );
};
