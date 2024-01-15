// FileUpload.tsx
import React from 'react';

type FileUploadProps = {
  onFileSelect: (file: File) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onFileSelect(file);
    }
  };

  return <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />;
};

export default FileUpload;
