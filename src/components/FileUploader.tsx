import React, { useRef } from 'react';

type FileUploaderProps = {
  onFileChange: (file: File | null) => void;
};

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <input
      id="file-upload-input"
      ref={inputRef}
      type="file"
      className="hidden"
      multiple
      onChange={e => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).slice(0, 5).forEach(file => onFileChange(file));
      }}
    />
  );
};

export default FileUploader;
