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
  dropdownValues: { [key: string]: string };
  setDropdownValues: (values: { [key: string]: string }) => void;
};

const EditableTable: React.FC<EditableTableProps> = ({
  data, onDataChange, tableId, collapsibleColumns = [], dropdownValues, setDropdownValues
}) => {

  const handleCellValueChange = (rowIndex: number, columnIndex: number, newValue: string) => {
    console.log("Row is %d", rowIndex)
    console.log("Column is %d", columnIndex)
    console.log("new value is %f", newValue)
    let updatedData = [...data];
  
    updatedData[rowIndex] = [...updatedData[rowIndex]]; // Clone the specific row
    updatedData[rowIndex][columnIndex] = newValue; // Update only the cell in the specific row

    console.log('values have been updated')
  
    onDataChange(updatedData);
  };

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
  const [collapsedRows, setCollapsedRows] = useState<Set<number>>(new Set());
  const dropdownValueMap = { "Option 1": 20, "Option 2": 30 }; // Example dropdown options

  const handleDropdownChange = (rowIndex: number, columnIndex: number, newValue: string) => {
    const key = `${tableId}-${rowIndex}-${columnIndex}`;
    console.log('value being updated is: ', key)
    setDropdownValues({ ...dropdownValues, [key]: newValue });

    console.log(rowIndex, columnIndex)

  
    // Update the data state
    let updatedData = [...data];

    console.log(updatedData)
    console.log(updatedData[rowIndex])
    console.log(updatedData[rowIndex][columnIndex])

    updatedData[rowIndex] = [...updatedData[rowIndex]];
    updatedData[rowIndex][columnIndex] = dropdownValueMap[newValue] || newValue;

    console.log(updatedData)
    console.log(updatedData[rowIndex])
    console.log(updatedData[rowIndex][columnIndex])
  
    onDataChange(updatedData);
  };
  
  const renderDropdown = (rowIndex: number, columnIndex: number) => {
    const key = `${tableId}-${rowIndex}-${columnIndex}`;
    const dropdownOptions = Object.keys(dropdownValueMap);
    const value = dropdownValues[key] || data[rowIndex][columnIndex];
    // console.log(key)

    return (
      <select
        value={value}
        onChange={(e) => handleDropdownChange(rowIndex, columnIndex, e.target.value)}
      >
        {dropdownOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  };

  const renderCollapsibleRow = (row: TableRow, rowIndex: number) => {
    return (
      collapsibleColumnIndexes.map(columnIndex => (
        <tr key={`${rowIndex}-collapsible-${columnIndex}`} >
          <td colSpan={row.length}>
            {data[0][columnIndex]}
          </td>
          <td colSpan={row.length}>
            {renderDropdown(rowIndex, columnIndex)}
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
            {tableId === "table1" && !collapsedRows.has(rowIndex) && renderCollapsibleRow(row, rowIndex)}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;