// FileUpload.tsx
import React from 'react';
import styled from 'styled-components';

type FileUploadProps = {
  onFileSelect: (file: File) => void;
};

const Input = styled.input.attrs({
  type: 'file'
})`
  display: none; // Hide the actual input
`;

const Button = styled.label`
  background: #3C474B;
  color: #fff;
  cursor: pointer;
  margin-bottom: 0;
  text-transform: uppercase;
  border-radius: 5px;
  height: 50px;
  width: 200px; // Control width here
  border-color: transparent;
  box-shadow: 0px;
  outline: none;
  transition: 0.15s;
  text-align: center;
  display: inline-block; // Allows width and height to be effective
  line-height: 50px; // Vertically center text
  font-size: 25px; // Control font size

  &:hover {
    background-color: #0090b0; // Slightly darker shade for hover
  }

  &:active {
    background-color: #f1ac15;
  }
`;


const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onFileSelect(file);
    }
  };

  // return <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />;
  return (
    <>
      <Input id="file-upload" onChange={handleFileChange} accept=".xlsx, .xls"  />
      <Button htmlFor="file-upload">Upload File</Button>
    </>
  );};

export default FileUpload;
