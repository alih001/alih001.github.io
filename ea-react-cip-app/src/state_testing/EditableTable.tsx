// EditableTable.tsx
import React, { useState } from 'react';

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
    let updatedData = [...data];
  
    updatedData[rowIndex] = [...updatedData[rowIndex]]; // Clone the specific row
    updatedData[rowIndex][columnIndex] = newValue; // Update only the cell in the specific row

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

  const arrayCollapsibleColumnIndexes = [2, 3];
  const costCollapsibleColumnIndexes = [2];
  const [collapsedRows, setCollapsedRows] = useState<Set<number>>(new Set());
  const dropdownValueMap = { "Option 1": 20, "Option 2": 30 }; // Example dropdown options
  const [outputValues, setOutputValues] = useState<{ [key: string]: string }>({});

  const handleDropdownChange = (rowIndex: number, columnIndex: number, newValue: string) => {
    const key = `${tableId}-${rowIndex}-${columnIndex}`;
    setDropdownValues({ ...dropdownValues, [key]: newValue });
  
    // Update outputValues state
    const outputKey = `${tableId}-${rowIndex}-${columnIndex}-output`;
    const outputValue = dropdownValueMap[newValue] || newValue;
    setOutputValues({ ...outputValues, [outputKey]: outputValue });
  
    // Update the data state
    let updatedData = [...data];
    updatedData[rowIndex] = [...updatedData[rowIndex]];
    updatedData[rowIndex][columnIndex] = outputValue;
    onDataChange(updatedData);
  };
  
  const renderDropdown = (rowIndex: number, columnIndex: number) => {
    const key = `${tableId}-${rowIndex}-${columnIndex}`;
    const dropdownOptions = Object.keys(dropdownValueMap);
    const value = dropdownValues[key] || data[rowIndex][columnIndex];
  
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
  
  const renderCollapsibleRow = (row: TableRow, rowIndex: number, collapsibleColumnIndexes:number[]) => {
    return (
      collapsibleColumnIndexes.map(columnIndex => (
        <tr key={`${rowIndex}-collapsible-${columnIndex}`}>
          <td className={`${tableId}-${rowIndex}-${columnIndex}-title`} colSpan={row.length}>
            {data[0][columnIndex]}
          </td>
          <td className={`${tableId}-${rowIndex}-${columnIndex}-value`} colSpan={row.length}>
            {renderDropdown(rowIndex, columnIndex)}
          </td>
          <td className={`${tableId}-${rowIndex}-${columnIndex}-output`} colSpan={row.length}>
            {outputValues[`${tableId}-${rowIndex}-${columnIndex}-output`] || ''}
          </td>
        </tr>
      ))
    );
  };

  if (tableId === "table1") {

    return (
      <table>
        <tbody>
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <tr>
                {/* Row cells */}
                {row.map((cell, colIndex) => {
                  // Check if the column index is not in the collapsibleColumnIndexes list
                  if (!arrayCollapsibleColumnIndexes.includes(colIndex)) {
                    return (
                      <td key={`${tableId}-${rowIndex}-${colIndex}`}>
                        {cell}
                      </td>
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
              {tableId === "table1" && !collapsedRows.has(rowIndex) && renderCollapsibleRow(row, rowIndex, arrayCollapsibleColumnIndexes)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    )
  } else {
    return (
      <table>
      <tbody>
        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <tr>
              {/* Row cells */}
              {row.map((cell, colIndex) => {
                // Check if the column index is not in the collapsibleColumnIndexes list
                if (!costCollapsibleColumnIndexes.includes(colIndex)) {
                  return (
                    <td key={`${tableId}-${rowIndex}-${colIndex}`}>
                      {cell}
                    </td>
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
            {tableId === "table1" && !collapsedRows.has(rowIndex) && renderCollapsibleRow(row, rowIndex, costCollapsibleColumnIndexes)}
          </React.Fragment>
        ))}
      </tbody>
      </table>
    )
  }
};

export default EditableTable;