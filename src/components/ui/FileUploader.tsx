import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export function FileUploader({ onFileSelect, loading }: FileUploaderProps) {
  return (
    <label 
      htmlFor="file-upload"
      className="relative cursor-pointer bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block"
    >
      <input
        id="file-upload"
        type="file"
        className="sr-only"
        accept="image/*,.pdf"
        onChange={onFileSelect}
        disabled={loading}
      />
      <div className="space-y-2">
        <div className="flex justify-center">
          {loading ? (
            <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
        </div>
        <div className="text-gray-600">
          <span className="font-medium text-indigo-600 hover:text-indigo-500">
            Upload a file
          </span>
          {' '}or drag and drop
        </div>
        <p className="text-xs text-gray-500">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </label>
  );
}