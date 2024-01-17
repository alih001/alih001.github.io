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

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const arrayCollapsibleColumnIndexes = [2, 3];
  const costCollapsibleColumnIndexes = [];
  const dropdownValueMap = {"High": 20,
                            "Medium": 10,
                            "Low": 5
                            };
  const stage1ScoreColumnIndex = data[0].indexOf("Stage 1 Score");
  const dropdownColumnIndex = arrayCollapsibleColumnIndexes[0];
  const [collapsedRows, setCollapsedRows] = useState<Set<number>>(new Set());
  const [outputValues, setOutputValues] = useState<{ [key: string]: string }>({});

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

  const handleDropdownChange = (rowIndex: number, columnIndex: number, newValue: string) => {
    const key = `${tableId}-${rowIndex}-${columnIndex}`;
    setDropdownValues({ ...dropdownValues, [key]: newValue });
  
    let updatedData = [...data];
    updatedData[rowIndex] = [...updatedData[rowIndex]];

    // Update the output value for score change
    updatedData[rowIndex][columnIndex] = dropdownValueMap[newValue] || newValue;
    const outputKey = `${tableId}-${rowIndex}-${columnIndex}-output`;
    const outputValue = dropdownValueMap[newValue] || newValue;
    setOutputValues({ ...outputValues, [outputKey]: outputValue });
    updatedData[rowIndex] = [...updatedData[rowIndex]];
    updatedData[rowIndex][columnIndex] = outputValue;

  
    // Check if we need to update Stage 1 Score
    if (columnIndex === dropdownColumnIndex && stage1ScoreColumnIndex !== -1) {
      const currentStage1Score = updatedData[rowIndex][stage1ScoreColumnIndex];
      updatedData[rowIndex][stage1ScoreColumnIndex] = outputValue * 2;
    }
  
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
          <td className={`${tableId}-${rowIndex}-${columnIndex}-title`}>
            {data[0][columnIndex]}
          </td>
          <td className={`${tableId}-${rowIndex}-${columnIndex}-value`}>
            {renderDropdown(rowIndex, columnIndex)}
          </td>
          <td className={`${tableId}-${rowIndex}-${columnIndex}-output`}>
            {outputValues[`${tableId}-${rowIndex}-${columnIndex}-output`] || dropdownValueMap[data[rowIndex][columnIndex]]}
          </td>
        </tr>
      ))
    );
  };

  if (tableId === "table1") {

    return (
      <table className="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          {data[0].map((header, index) => {
            // Hide the header for collapsible columns
            if (!arrayCollapsibleColumnIndexes.includes(index)) {
              return <th key={index}>{header}</th>;
            }
            return null;
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {rowIndex > 0 && (
              <>
                <tr>
                  {row.map((cell, colIndex) => {
                    if (!arrayCollapsibleColumnIndexes.includes(colIndex)) {
                      return <td key={`${tableId}-${rowIndex}-${colIndex}`}>{cell}</td>;
                    }
                    return null;
                  })}
                  {/* Toggle button for collapsible rows */}
                  <td>
                    <button onClick={() => toggleRowCollapse(rowIndex)}>
                      {collapsedRows.has(rowIndex) ? 'Show' : 'Hide'}
                    </button>
                  </td>
                </tr>
                {/* Render collapsible rows */}
                {tableId === "table1" && !collapsedRows.has(rowIndex) && renderCollapsibleRow(row, rowIndex, arrayCollapsibleColumnIndexes)}
              </>
            )}
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