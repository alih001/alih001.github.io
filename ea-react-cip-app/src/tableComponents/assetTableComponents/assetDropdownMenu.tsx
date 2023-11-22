// DropdownMenu.tsx
import React, { useState, ChangeEvent } from 'react';
import countryOptions from '../../data/optionsData.json';

interface DropdownMenuProps {
  onOptionChange: (value: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ onOptionChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>(countryOptions[0]);

  const handleOptionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onOptionChange(selectedValue);
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
