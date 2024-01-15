// EditableTable.tsx
import React, { useState } from 'react';

type EditableCellProps = {
  value: string;
  onValueChange: (newValue: string) => void;
  isDropdown?: boolean;
  dropdownOptions?: string[];
};

const EditableCell: React.FC<EditableCellProps> = ({ 
  value, 
  onValueChange, 
  isDropdown = false, 
  dropdownOptions = [] 
}) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  const handleBlur = () => {
    onValueChange(localValue);
    setEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocalValue(e.target.value);
  };

  return (
    <td onClick={() => setEditing(true)}>
      {editing ? (
        isDropdown ? (
          <select value={localValue} onChange={handleChange} onBlur={handleBlur}>
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        )
      ) : (
        value
      )}
    </td>
  );
};


type EditableTableProps = {
  data: string[][];
  onDataChange: (newData: string[][]) => void;
  tableId: string;
};

const dropdownValueMap = {
  "Option 1": 20,
  "Option 2": 30,
  // ... other options
};

// Define the coordinates for the dropdown cell
const dropdownRow = 0;
const dropdownColumn = 0;

const EditableTable: React.FC<EditableTableProps> = ({ data, onDataChange, tableId }) => {
  const handleCellValueChange = (rowIndex: number, colIndex: number, newValue: string) => {
    let updatedData = [...data];

    if (rowIndex === dropdownRow && colIndex === dropdownColumn) {
      updatedData[rowIndex][colIndex] = newValue;
      const newThirdColValue = dropdownValueMap[newValue] || 0;
      updatedData[rowIndex][2] = newThirdColValue.toString();
    } else {
      updatedData[rowIndex][colIndex] = newValue;
    }

    onDataChange(updatedData);
  };

  return (
    <table>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => {
              const isDropdown = rowIndex === dropdownRow && colIndex === dropdownColumn;
              const dropdownOptions = isDropdown ? Object.keys(dropdownValueMap) : [];

              return (
                <EditableCell
                  key={`${tableId}-${rowIndex}-${colIndex}`}
                  value={cell}
                  onValueChange={(newValue) => handleCellValueChange(rowIndex, colIndex, newValue)}
                  isDropdown={isDropdown}
                  dropdownOptions={dropdownOptions}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;