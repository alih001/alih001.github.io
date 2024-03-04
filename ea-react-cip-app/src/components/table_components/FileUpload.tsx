// FileUpload.tsx
import React from 'react';
import styled from 'styled-components';
import { FileUploadProps } from '../../types/public-types'

const Input = styled.input.attrs({
  type: 'file'
})`
  display: none; // Hide the actual input
`;

const Button = styled.label`
  background: #3D314A;
  color: #fff;
  cursor: pointer;
  margin-bottom: 1rem;
  margin-left: 10rem;
  text-transform: uppercase;
  border-radius: 5px;
  height: 60px;
  width: 300px; // Control width here
  border-color: transparent;
  box-shadow: 0px;
  outline: none;
  transition: 0.15s;
  text-align: center;
  display: inline-block; // Allows width and height to be effective
  line-height: 60px; // Vertically center text
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

  return (
    <>
      <Input id="file-upload" onChange={handleFileChange} accept=".xlsx, .xls"  />
      <Button htmlFor="file-upload">Upload File</Button>
    </>
  );};

export default FileUpload;
