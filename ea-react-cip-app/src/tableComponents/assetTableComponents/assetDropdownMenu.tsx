// assetDropdownMenu.tsx
import React, { useState, ChangeEvent } from 'react';
import countryOptions from '../../data/optionsData.json';

interface DropdownMenuProps {
  onOptionChange: (value: string) => void;
}

const DropdownMenu = ({ selectedOption, onOptionChange }) => {
  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onOptionChange(event.target.value);
  };

  return (
    <select value={selectedOption} onChange={handleOptionChange}>
      {countryOptions.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};


export default DropdownMenu;
