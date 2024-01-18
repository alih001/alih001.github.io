// CostTable.tsx
import React, { useState, useEffect, useMemo } from 'react';
import './tableStyles.css';
import CustomModal from './CustomModal';
import { Button, Form } from 'react-bootstrap';

type CostTableProps = {
  data: string[][];
  onDataChange: (newData: string[][]) => void;
  tableId: string;
  collapsibleColumns?: string[];
  dropdownValues: { [key: string]: string };
  setDropdownValues: (values: { [key: string]: string }) => void;
  collapsedGroups: Set<string>;
  setCollapsedGroups: (groups: Set<string>) => void;
};

const CostTable: React.FC<CostTableProps> = ({
  data, onDataChange, tableId, collapsibleColumns = [], dropdownValues, setDropdownValues,
  collapsedGroups, setCollapsedGroups
}) => {

    const [showModal, setShowModal] = useState(false);
    const [sliderValue, setSliderValue] = useState(50); // Initial slider value
  
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    const handleSliderChange = (e) => setSliderValue(e.target.value);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const startYearOptions = Array.from({ length: 2060 - 2020 }, (_, index) => 2020 + index);
    const startDurationOptions = Array.from({ length: 15 }, (_, index) => 0 + index);
    
    // Function to check if a row is a group header
    const isGroupHeader = (row: string[]) => {
        return row[1].includes("Package Summary");
        };

    // Function to toggle group collapse state
    const toggleGroup = (groupName: string) => {
        setCollapsedGroups(prev => {
        const newCollapsedGroups = new Set(prev);
        if (newCollapsedGroups.has(groupName)) {
            newCollapsedGroups.delete(groupName);
        } else {
            newCollapsedGroups.add(groupName);
        }
        return newCollapsedGroups;
        });
    };

    // Function to determine if a row should be displayed
    const shouldDisplayRow = (row: string[], rowIndex: number) => {
        if (rowIndex === 0 || isGroupHeader(row)) return true; // Always show header and group headers
        const groupName = row[0]; // Assuming the group name is in the first cell
        return !collapsedGroups.has(groupName);
    };

    const handleYearChange = (rowIndex: number, colIndex: number,newValue: string) => {
        const newYear = parseInt(newValue, 10);
        const updatedRow = shiftRowDataForYear(data[rowIndex], newYear);
        
        let updatedData = [...data];
        updatedData[rowIndex] = updatedRow;
        updatedData[rowIndex][colIndex] = newYear;

        const currentGroupName = updatedData[rowIndex][0];
        let headerRowIndex = 0;
        while (headerRowIndex < updatedData.length && updatedData[headerRowIndex][0] !== currentGroupName) {
          headerRowIndex++;
        }

        // Check logical dependecies (e.g. is construction before design)
        const feasibilityStart = updatedData[headerRowIndex+1][2]; 
        const designStart = updatedData[headerRowIndex+2][2]; 
        const constructionStart = updatedData[headerRowIndex+3][2]; 

        if (designStart < feasibilityStart) {
            alert("Design year cannot be earlier than feasibility year.");
            return;
        }
        if (constructionStart < designStart) {
            alert("Construction year cannot be earlier than design year.");
            return;
        }
        onDataChange(updatedData);
        updateTotalCosts(rowIndex, updatedData)
    };
      
    const yearToColumnIndex = (year: number) => {
        const baseYear = 2024;  // Adjust this to the year of the first column
        return 6 + (year - baseYear);  // 4 is the column index for the base year
    };

    const shiftRowDataForYear = (row: any[], startYear: number) => {
        const columnIndex = yearToColumnIndex(startYear);
        const newRow = row.slice(6).filter(value => value !== 0 && value !== "-");
      
        let updatedRow = [...row];

        for (let i = 6; i < updatedRow.length; i++) {
            updatedRow[i] = "-";
          }

        for (let i = 0; i < newRow.length; i++) {
            if (columnIndex + i < updatedRow.length) {
            updatedRow[columnIndex + i] = newRow[i];
            }
        }
      
        return updatedRow;
      };
      
    const renderYearDropdown = (rowIndex: number, colIndex: number, currentValue: any) => {
        return (
        <select
            value={currentValue}
            onChange={(e) => handleYearChange(rowIndex, colIndex, e.target.value)}
        >
            {startYearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
            ))}
        </select>
        );
    };

    const shiftRowDataForDuration = (row: any[], currentTotal: number, newDuration: number, startYear: number) => {

        const assignedValue = parseInt(currentTotal / newDuration, 10)
        const columnIndex = yearToColumnIndex(startYear);
      
        let updatedRow = [...row];

        for (let i = 6; i < updatedRow.length; i++) {
            updatedRow[i] = "-";
          }

        for (let i = 0; i < newDuration; i++) {
            if (columnIndex + i < updatedRow.length) {
            updatedRow[columnIndex + i] = assignedValue;
            }
        }
      
        return updatedRow;
      };

    const handleDurationChange = (rowIndex: number, colIndex: number,newValue: string) => {
        const newDuration = parseInt(newValue, 10);
        const currentTotal = data[rowIndex][5]
        const startYear = data[rowIndex][2]
        const updatedRow = shiftRowDataForDuration(data[rowIndex], currentTotal, newDuration, startYear);


        let updatedData = [...data];
        updatedData[rowIndex] = updatedRow;
        updatedData[rowIndex][colIndex] = newValue;
        onDataChange(updatedData);
        updateTotalCosts(rowIndex, updatedData)
      };

    const renderDurationDropdown = (rowIndex: number, colIndex: number, currentValue: any) => {
        return (
        <select
            value={currentValue}
            onChange={(e) => handleDurationChange(rowIndex, colIndex, e.target.value)}
        >
            {startDurationOptions.map(duration => (
            <option key={duration} value={duration}>{duration}</option>
            ))}
        </select>
        );
    };

    const handleCostSplitChange = (rowIndex: number, colIndex: number, newValue: string) => {
        const sliderValue = parseInt(newValue, 10);
        const currentGroupName = data[rowIndex][0];
      
        // Find the related group header row by searching from the start
        let headerRowIndex = 0;
        while (headerRowIndex < data.length && data[headerRowIndex][0] !== currentGroupName) {
          headerRowIndex++;
        }

        if (headerRowIndex >= data.length) {
          // Group header not found, handle appropriately
          return;
        }
      
        // // Assuming total package cost is at a specific index (e.g., 4)
        const totalPackageCost = parseInt(data[headerRowIndex][5], 10);
        
        // // Calculate new package cost based on slider value
        const newPackageCost = (totalPackageCost * sliderValue) / 100;
      
        // Update the data
        let updatedData = [...data];
        updatedData[rowIndex][4] = newValue; // Update package cost for this row
        updatedData[rowIndex][5] = newPackageCost; // Update package cost for this row

        // Update Duration Split with new Cost Split
        const updatedRow = shiftRowDataForDuration(updatedData[rowIndex], newPackageCost, updatedData[rowIndex][3], updatedData[rowIndex][2]);
        updatedData[rowIndex] = updatedRow;
        onDataChange(updatedData);

        updateTotalCosts(rowIndex, updatedData)

      };
      
    const updateTotalCosts = (rowIndex:number, updatedData) => {
        const currentGroupName = updatedData[rowIndex][0]
        let headerRowIndex = 0
        while (headerRowIndex < updatedData.length && updatedData[headerRowIndex][0] !== currentGroupName) {
            headerRowIndex++;
          }

        if (headerRowIndex >= updatedData.length) {
        // Group header not found, handle appropriately
        return;
        }

        // Check logical dependecies (e.g. is construction before design)
        const totalRow = updatedData[headerRowIndex]; 
        const feasibilityRow = updatedData[headerRowIndex+1]; 
        const designRow = updatedData[headerRowIndex+2]; 
        const constructionRow = updatedData[headerRowIndex+3]; 

        // Start from column index 7
        for (let colIndex = 6; colIndex < totalRow.length; colIndex++) {
            const feasibilityValue = parseInt(feasibilityRow[colIndex], 10) || 0;
            const designValue = parseInt(designRow[colIndex], 10) || 0;
            const constructionValue = parseInt(constructionRow[colIndex], 10) || 0;

            totalRow[colIndex] = feasibilityValue + designValue + constructionValue;
        }

        onDataChange([...updatedData]);

        }

    const rendercostSplitSlider = (rowIndex: number, colIndex: number, currentValue: number) => {
        return (
          <input 
            type="range" 
            min="0" 
            max="100"  // Assuming a maximum duration of 15
            value={currentValue} 
            onChange={(e) => handleCostSplitChange(rowIndex, colIndex, e.target.value)}
          />
        );
      };
      
    const renderCellContent = (row: string[], rowIndex: number, colIndex: number, cell: any) => {
        if (colIndex === 2 && !isGroupHeader(row)) {
            return renderYearDropdown(rowIndex, colIndex, cell);
        } else if (colIndex === 3 && !isGroupHeader(row)) {
            return renderDurationDropdown(rowIndex, colIndex, cell);
        } else if (colIndex === 4 && !isGroupHeader(row)) {
            return rendercostSplitSlider(rowIndex, colIndex, cell);
        }
        else if (cell === 0) {
            return '-';
        }
        else {
            return cell;
        }
    };

    return (
    <table>
        <thead>
            <tr>
                {data[0].map((header, index) => {
                return <th key={index}>{header}</th>;
                })}
            </tr>
        </thead>
        <tbody>
            {data.map((row, rowIndex) => {
            if (!shouldDisplayRow(row, rowIndex)) return null;

            return (
                <React.Fragment key={rowIndex}>
                {rowIndex > 0 && (
                <>
                    {/* Use the CustomModal component */}
                    <CustomModal 
                        showModal={showModal}
                        closeModal={closeModal}
                        sliderValue={sliderValue}
                        handleSliderChange={handleSliderChange}
                    />
                    <tr>
                        {/* Render cells */}
                        {row.map((cell, colIndex) => (
                            <td key={`${tableId}-${rowIndex}-${colIndex}`}>
                                {renderCellContent(row, rowIndex, colIndex, cell)}
                            </td>
                        ))}

                        {/* Toggle button for group headers */}
                        {isGroupHeader(row) && (
                        <>
                        <td>
                            <button onClick={() => toggleGroup(row[0])}>
                            {collapsedGroups.has(row[0]) ? 'Expand' : 'Collapse'}
                            </button>
                        </td>
                        <td>
                            <Button onClick={openModal}>Edit Total Cost</Button>
                        </td>
                        </>
                        )}
                    </tr>
                </>
                )}
                {/* ... [rest of the row rendering logic] */}
                </React.Fragment>
            );
            })}
        </tbody>
    </table>
    );
};

export default CostTable;