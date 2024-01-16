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
  collapsibleColumns?: string[];
};

const dropdownValueMap = {
  "Option 1": 20,
  "Option 2": 30,
  // ... other options
};

// Define the coordinates for the dropdown cell
const dropdownRow = 1;
const dropdownColumn = 2;

const EditableTable: React.FC<EditableTableProps> = ({ data, onDataChange, tableId, collapsibleColumns = [] }) => {
  const handleCellValueChange = (rowIndex: number, colIndex: number, newValue: string) => {
    let updatedData = [...data];

    if (rowIndex === dropdownRow && colIndex === dropdownColumn) {
      updatedData[rowIndex][colIndex] = newValue;
      const newThirdColValue = dropdownValueMap[newValue] || 0;
      updatedData[rowIndex][4] = newThirdColValue.toString();
    } else {
      updatedData[rowIndex][colIndex] = newValue;
    }

    onDataChange(updatedData);
  };

  const [collapsedRows, setCollapsedRows] = useState<Set<number>>(new Set());

  const toggleRowCollapse = (rowIndex: number) => {
    setCollapsedRows(prev => {
      const newCollapsedRows = new Set(prev);
      if (newCollapsedRows.has(rowIndex)) {
        newCollapsedRows.delete(rowIndex);
      } else {
        newCollapsedRows.add(rowIndex);
      }
      return newCollapsedRows;
    });
  };

  const collapsibleColumnIndexes = [2, 3]; // Array of collapsible column indices

  const renderCollapsibleRow = (row: TableRow, rowIndex: number) => {
    return (
      collapsibleColumnIndexes.map(columnIndex => (
        <tr key={`${rowIndex}-collapsible-${columnIndex}`}>
          <td colSpan={row.length}>
            {data[0][columnIndex]} Details: {row[columnIndex]}
          </td>
        </tr>
      ))
    );
  };

  return (
    <table>
      <tbody>
        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <tr>
              {/* Row cells */}
              {row.map((cell, colIndex) => {
                // Check if the column index is not in the collapsibleColumnIndexes list
                if (!collapsibleColumnIndexes.includes(colIndex)) {
                  return (
                    <EditableCell
                      key={`${tableId}-${rowIndex}-${colIndex}`}
                      value={cell}
                      onValueChange={(newValue) => handleCellValueChange(rowIndex, colIndex, newValue)}
                    />
                  );
                }
                return null
              })}
              {/* Toggle button for collapsible rows */}
              {tableId === "table1" && (
                <td>
                  <button onClick={() => toggleRowCollapse(rowIndex)}>
                    {collapsedRows.has(rowIndex) ? 'Show' : 'Hide'}
                  </button>
                </td>
              )}
            </tr>
            {/* Collapsible rows */}
            {!collapsedRows.has(rowIndex) && renderCollapsibleRow(row, rowIndex)}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;