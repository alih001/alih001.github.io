// AssetTable.tsx
import React, { useEffect, useMemo } from 'react';
import '../../styles/tableStyles.css';
import { useData } from '../../contexts/useDataContext';
import { TableRow, AssetTableProps, DropdownValueMapType, StagesFactorMapType } from '../../types/public-types'


const AssetTable: React.FC<AssetTableProps> = ({
    data, onDataChange, tableId
  }) => {

  const arrayCollapsibleColumnIndexes = useMemo (() => [
    4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
  ], []);

  const dropdownValueMap: DropdownValueMapType = useMemo(() => ({
      "None": 0,
      "Low": 2,
      "Medium": 4,
      "High": 6
    }), []);

  const category1FactorsMap: StagesFactorMapType = useMemo(() => ({
      2: 0.5,
      3: 1.5,
      4: 0.2,
      5: 0.2,
      6: 0.2,
      7: 0.2,
    }), []);
  
  const category2FactorsMap: StagesFactorMapType = useMemo(() => ({
      2: 0.9,
      4: 2.3,
    }), []);
  
  const dropdownColumnIndexes = useMemo(() => [
      arrayCollapsibleColumnIndexes[0],
      arrayCollapsibleColumnIndexes[1],
      arrayCollapsibleColumnIndexes[2],
      arrayCollapsibleColumnIndexes[3],
      arrayCollapsibleColumnIndexes[4],
      arrayCollapsibleColumnIndexes[5],
    ], [arrayCollapsibleColumnIndexes]);

  const { dropdownValues, setDropdownValues } = useData();
  const { collapsedAssetRows, setCollapsedAssetRows } = useData();
  const { outputValues, setOutputValues } = useData();

  useEffect(() => {
    const initialOutputValues: { [key: string]: number } = {};

    data.forEach((row: TableRow, rowIndex: number) => {
      if (rowIndex > 0) { // Skip the header row
        dropdownColumnIndexes.forEach((columnIndex: number) => {
          const key = `${tableId}-${rowIndex}-${columnIndex}-output`;
          const value = dropdownValueMap[row[columnIndex]] ?? Number(row[columnIndex]);
          initialOutputValues[key] = !isNaN(value) ? value : 0;
        });
      }
    });

    setOutputValues(initialOutputValues);
  }, [data, tableId, dropdownValueMap, dropdownColumnIndexes, setOutputValues]);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  const category1ScoreColumnIndex = data[0].indexOf("Category (I) Score");
  const category2ScoreColumnIndex = data[0].indexOf("Category (II) Score");
  const totalScoreColumnIndex = data[0].indexOf("Step (I) Score");

  const toggleRowCollapse = (rowIndex: number) => {
    setCollapsedAssetRows(prev => {
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
  
    const updatedData = [...data];
    updatedData[rowIndex] = [...updatedData[rowIndex]];

    // Update the output value for score change
    updatedData[rowIndex][columnIndex] = dropdownValueMap[newValue] || newValue;
    const outputKey = `${tableId}-${rowIndex}-${columnIndex}-output`;
    const outputValue = dropdownValueMap[newValue] || 0;
    setOutputValues({ ...outputValues, [outputKey]: outputValue });
    updatedData[rowIndex] = [...updatedData[rowIndex]];
    updatedData[rowIndex][columnIndex] = outputValue;

    // Update scores if the changed column is one of the dropdown columns
    if (dropdownColumnIndexes.includes(columnIndex)) {
      let category1Score = 0;
      let category2Score = 0;
      console.log("About to loop through all explicity defined ddms")
      // Loop through dropdown columns to calculate scores
      dropdownColumnIndexes.forEach((dropdownColIndex, _idx) => {
        const outputKey = `${tableId}-${rowIndex}-${dropdownColIndex}-output`;
        const category1Factor = category1FactorsMap[dropdownColIndex] || 0;
        const category2Factor = category2FactorsMap[dropdownColIndex] || 0;
    
        let outputValue = (dropdownValueMap[newValue] || 0);

        if (dropdownColIndex === columnIndex) {
          // Current dropdown change
          setOutputValues({ ...outputValues, [outputKey]: outputValue });
        } else {
          // Other dropdowns
          outputValue = outputValues[outputKey] || 0;
          
        }

        category1Score += outputValue * category1Factor;
        category2Score += outputValue * category2Factor;


      });

      // Update Stage 1 Score and Stage 2 Score
      if (category1ScoreColumnIndex !== -1) {
        updatedData[rowIndex][category1ScoreColumnIndex] = category1Score.toFixed(2);
      }
      if (category2ScoreColumnIndex !== -1) {
        updatedData[rowIndex][category2ScoreColumnIndex] = category2Score.toFixed(2);
      }
      // Check if we need to update Total Score
      if (totalScoreColumnIndex !== -1) {
        updatedData[rowIndex][totalScoreColumnIndex] = category1Score + category2Score
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
  
  const renderCollapsibleRowHeader = () => {
    return (
      <tr className="collapsible-row-header">
        <td></td> 
        <td className="header-cell">Attribute</td>
        <td className="header-cell">Value</td>
        <td className="header-cell">Output (If applicable)</td>
      </tr>
    );
  };
  

  const renderCollapsibleRow = (row: TableRow, rowIndex: number, collapsibleColumnIndexes:number[]) => {
      return (
          <>
            {/* Render the header row for the collapsible set */}
            {renderCollapsibleRowHeader()}
            {/* Render the collapsible rows */}
            {collapsibleColumnIndexes.map(columnIndex => (
                <tr key={`${rowIndex}-collapsible-${columnIndex}`}>
                    <td className={`${tableId}-${rowIndex}-${columnIndex}-placeholder`}></td>
                    <td className={`${tableId}-${rowIndex}-${columnIndex}-title`}>{data[0][columnIndex]}</td>
                    <td className={`${tableId}-${rowIndex}-${columnIndex}-value`}>
                        {dropdownColumnIndexes.includes(columnIndex) ? renderDropdown(rowIndex, columnIndex) : row[columnIndex]}
                    </td>
                    <td className={`${tableId}-${rowIndex}-${columnIndex}-output`}>
                        {outputValues[`${tableId}-${rowIndex}-${columnIndex}-output`] || dropdownValueMap[data[rowIndex][columnIndex]]}
                    </td>
                </tr>
              ))}
          </>
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
                        {collapsedAssetRows.has(rowIndex) ? 'Show' : 'Hide'}
                    </button>
                    </td>
                </tr>
                {/* Render collapsible rows */}
                {tableId === "table1" && !collapsedAssetRows.has(rowIndex) && renderCollapsibleRow(row, rowIndex, arrayCollapsibleColumnIndexes)}
                </>
            )}
            </React.Fragment>
        ))}
        </tbody>
    </table>    
    )
};

export default AssetTable;