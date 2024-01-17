// CostTable.tsx
import React, { useState, useEffect, useMemo } from 'react';

type CostTableProps = {
  data: string[][];
  onDataChange: (newData: string[][]) => void;
  tableId: string;
  collapsibleColumns?: string[];
  dropdownValues: { [key: string]: string };
  setDropdownValues: (values: { [key: string]: string }) => void;
  collapsedGroups: any;
  setCollapsedGroups: any;
};

const CostTable: React.FC<CostTableProps> = ({
  data, onDataChange, tableId, collapsibleColumns = [], dropdownValues, setDropdownValues,
  collapsedGroups, setCollapsedGroups
}) => {

    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

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
    
        onDataChange(updatedData);
    };
      
    const yearToColumnIndex = (year: number) => {
        const baseYear = 2024;  // Adjust this to the year of the first column
        return 5 + (year - baseYear);  // 4 is the column index for the base year
    };

    const shiftRowDataForYear = (row: any[], startYear: number) => {
        const columnIndex = yearToColumnIndex(startYear);
        const newRow = row.slice(5).filter(value => value !== 0 && value !== "-");
      
        let updatedRow = [...row];

        for (let i = 5; i < updatedRow.length; i++) {
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
        // const newRow = row.slice(5).filter(value => value !== 0 && value !== "-");
      
        let updatedRow = [...row];

        for (let i = 5; i < updatedRow.length; i++) {
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
        const currentTotal = data[rowIndex][4]
        const startYear = data[rowIndex][2]
        const updatedRow = shiftRowDataForDuration(data[rowIndex], currentTotal, newDuration, startYear);


        let updatedData = [...data];
        updatedData[rowIndex] = updatedRow;
        updatedData[rowIndex][colIndex] = newValue;
        onDataChange(updatedData);
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
      
    const renderCellContent = (row: string[], rowIndex: number, colIndex: number, cell: any) => {
        if (colIndex === 2 && !isGroupHeader(row)) {
            return renderYearDropdown(rowIndex, colIndex, cell);
        } else if (colIndex === 3 && !isGroupHeader(row)) {
            return renderDurationDropdown(rowIndex, colIndex, cell);
        } else if (cell === 0) {
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
                    <tr>
                        {/* Render cells */}
                        {row.map((cell, colIndex) => (
                            <td key={`${tableId}-${rowIndex}-${colIndex}`}>
                                {renderCellContent(row, rowIndex, colIndex, cell)}
                            </td>
                        ))}

                        {/* Toggle button for group headers */}
                        {isGroupHeader(row) && (
                        <td>
                            <button onClick={() => toggleGroup(row[0])}>
                            {collapsedGroups.has(row[0]) ? 'Expand' : 'Collapse'}
                            </button>
                        </td>
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