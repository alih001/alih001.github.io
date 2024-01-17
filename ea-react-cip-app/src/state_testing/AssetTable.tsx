// AssetTable.tsx
import React, { useState, useEffect, useMemo } from 'react';

type AssetTableProps = {
  data: string[][];
  onDataChange: (newData: string[][]) => void;
  tableId: string;
  collapsibleColumns?: string[];
  dropdownValues: { [key: string]: string };
  setDropdownValues: (values: { [key: string]: string }) => void;
};

const AssetTable: React.FC<AssetTableProps> = ({
  data, onDataChange, tableId, collapsibleColumns = [], dropdownValues, setDropdownValues
}) => {

  const arrayCollapsibleColumnIndexes = useMemo (() => [2, 3, 4], 
  []);
  const dropdownValueMap = useMemo(() => ({
  "High": 20,
  "Medium": 10,
  "Low": 5
  }), []);

  const dropdownColumnIndexes = useMemo(() => [
  arrayCollapsibleColumnIndexes[0],
  arrayCollapsibleColumnIndexes[1],
  arrayCollapsibleColumnIndexes[2]
  ], [arrayCollapsibleColumnIndexes]);

  const [collapsedRows, setCollapsedRows] = useState<Set<number>>(new Set());
  const [outputValues, setOutputValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialOutputValues: { [key: string]: number } = {};

    data.forEach((row, rowIndex) => {
      if (rowIndex > 0) { // Skip the header row
        dropdownColumnIndexes.forEach(columnIndex => {
          const key = `${tableId}-${rowIndex}-${columnIndex}-output`;
          initialOutputValues[key] = dropdownValueMap[row[columnIndex]] || row[columnIndex];
        });
      }
    });

    setOutputValues(initialOutputValues);
  }, [data, tableId, dropdownValueMap, dropdownColumnIndexes]);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const stage1ScoreColumnIndex = data[0].indexOf("Stage 1 Score");
  const stage2ScoreColumnIndex = data[0].indexOf("Stage 2 Score");
  const totalScoreColumnIndex = data[0].indexOf("Total");


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

  
    // Update scores if the changed column is one of the dropdown columns
    if (dropdownColumnIndexes.includes(columnIndex)) {
      let stage1Score = 0;
      let stage2Score = 0;
      console.log("About to loop through all explicity defined ddms")
      // Loop through dropdown columns to calculate scores
      dropdownColumnIndexes.forEach((dropdownColIndex, idx) => {
        const outputKey = `${tableId}-${rowIndex}-${dropdownColIndex}-output`;
        let outputValue = (dropdownValueMap[newValue] || newValue);

        if (dropdownColIndex === columnIndex) {
          // Current dropdown change
          setOutputValues({ ...outputValues, [outputKey]: outputValue });
        } else {
          // Other dropdowns
          outputValue = outputValues[outputKey] || 0;
        }

        stage1Score += outputValue; // Adjust this formula as needed
        stage2Score += outputValue; // Adjust this formula as needed

      });

      // Update Stage 1 Score and Stage 2 Score
      if (stage1ScoreColumnIndex !== -1) {
        updatedData[rowIndex][stage1ScoreColumnIndex] = stage1Score;
      }
      if (stage2ScoreColumnIndex !== -1) {
        updatedData[rowIndex][stage2ScoreColumnIndex] = stage2Score;
      }
      // Check if we need to update Total Score
      if (totalScoreColumnIndex !== -1) {
        updatedData[rowIndex][totalScoreColumnIndex] = stage1Score + stage2Score
      }

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
            {dropdownColumnIndexes.includes(columnIndex) ? renderDropdown(rowIndex, columnIndex) : row[columnIndex]}
          </td>
          <td className={`${tableId}-${rowIndex}-${columnIndex}-output`}>
            {outputValues[`${tableId}-${rowIndex}-${columnIndex}-output`] || dropdownValueMap[data[rowIndex][columnIndex]]}
          </td>
        </tr>
      ))
    );
  };

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
};

export default AssetTable;