import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';

type FileUploadButtonProps = {
  onFileUpload: (file: File) => PromiseLike<void>;
  className?: string;
};

const FileUploadButton = forwardRef<HTMLSpanElement, FileUploadButtonProps>(
  ({ onFileUpload, className }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        onFileUpload(e.dataTransfer.files[0]);
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileUpload(e.target.files[0]);
      }
    };

    return (
      <span
        ref={ref}
        className={clsx(
          'cursor-pointer',
          isDragOver ? 'opacity-50' : 'opacity-100',
          className,
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="file-upload" className="cursor-pointer">
          <i className="fa-solid fa-file-arrow-up text-sm text-gray-300"></i>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
            onClick={(e) => (e.currentTarget.value = '')}
          />
        </label>
      </span>
    );
  },
);

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
