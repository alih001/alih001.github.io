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

//   const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(data.map(row => row[0])));

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
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
    
  return (
    <table>
      <tbody>
        {data.map((row, rowIndex) => {
          if (!shouldDisplayRow(row, rowIndex)) return null;

          return (
            <React.Fragment key={rowIndex}>
              <tr>
                {/* Render cells */}
                {row.map((cell, colIndex) => (
                <td key={`${tableId}-${rowIndex}-${colIndex}`}>
                    {cell === 0 ? '-' : cell}
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
              {/* ... [rest of the row rendering logic] */}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default CostTable;