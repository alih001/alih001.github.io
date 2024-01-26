// CostTable.tsx
import React, { useState, useEffect, useMemo } from 'react';
import '../styles/tableStyles.css';
import CustomModal from '../state_testing/CustomModal';
import { Button, Form, Modal } from 'react-bootstrap';
import Dashboard from '../state_testing/Dashboard';

type Node = {
  id: string;
  name: string;
  x: number;
  y: number;
};

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

    const packageOptions = useMemo(() => {
        // Extract unique package names from data
        const packages = new Set(data.map(row => row[0]));
        return Array.from(packages);
      }, [data]);

    const [showModal, setShowModal] = useState(false);
    const [sliderValue, setSliderValue] = useState(50);
    const [editingRowIndex, setEditingRowIndex] = useState(null); // Track the row being edited
    const [selectedPackages, setSelectedPackages] = useState(new Set());
    const [showChecklistModal, setShowChecklistModal] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        // Initialize selected packages only once
        const allPackages = new Set(data.map(row => row[0]));
        setSelectedPackages(allPackages);
    }, []);
    
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }
  
    const handleSliderChange = (e) => setSliderValue(e.target.value);
  
    const openModal = (rowIndex) => {
      setEditingRowIndex(rowIndex);
      setShowModal(true);
    };
  
    const closeModal = () => {
      setShowModal(false);
      setEditingRowIndex(null);
    };

    const handleAddNode = (x: number, y: number) => {
        setNodes(prevNodes => [
          ...prevNodes, 
          { id: `node-${prevNodes.length + 1}`, name: `Node ${prevNodes.length + 1}`, x, y }
        ]);
      };
      

    const startYearOptions = Array.from({ length: 2060 - 2020 }, (_, index) => 2020 + index);
    const startDurationOptions = Array.from({ length: 15 }, (_, index) => 0 + index);
    
    const renderChecklistModal = () => {
        if (!showChecklistModal) return null;
      
        const handleModalClose = () => {
          setShowChecklistModal(false);
        };
      
        return (
          <Modal show={showChecklistModal} onClose={handleModalClose}>
            <h2>Package Filter</h2>
            <div className="package-checklist">
              {packageOptions.map(packageName => (
                <div key={packageName}>
                  <input
                    type="checkbox"
                    checked={selectedPackages.has(packageName)}
                    onChange={(e) => handlePackageCheckChange(packageName, e.target.checked)}
                  />
                  {packageName}
                </div>
              ))}
            </div>
            <Button variant="primary" onClick={handleModalClose}>Apply Filter</Button>
          </Modal>
        );
      };
      

    const handlePackageCheckChange = (packageName, isChecked) => {
        setSelectedPackages(prev => {
        const newSelected = new Set(prev);
        if (isChecked) {
            newSelected.add(packageName);
        } else {
            newSelected.delete(packageName);
        }
        return newSelected;
        });
    };
    
    const filteredData = data.filter((row, rowIndex) => {
        // Skip header row
        if (rowIndex === 0) return true;
      
        // Include rows whose package is selected
        return selectedPackages.has(row[0]);
      });
      
    const updateCostSplits = (rowIndex:number, totalPackageCost: number) => {

        if (rowIndex !== null) {

            let updatedData = [...data];

            for (let i = 1; i <= 3; i++) {
              if (rowIndex + i < updatedData.length) {
                updatedData[rowIndex + i][5] = (totalPackageCost * updatedData[rowIndex + i][4]) / 100;
                const updatedPackageCost = updatedData[rowIndex+i][5]
                const updatedRow = shiftRowDataForDuration(updatedData[rowIndex+i], updatedPackageCost, updatedData[rowIndex+i][3], updatedData[rowIndex+i][2]);
                updatedData[rowIndex + i] = updatedRow;
                }
            }
            onDataChange(updatedData);
            closeModal(); // Close the modal
          }
    }

    const handleSave = () => {
        if (editingRowIndex !== null) {

          data[editingRowIndex][5] = sliderValue;

          onDataChange(data);
          updateCostSplits(editingRowIndex, sliderValue)

          closeModal();
        }
      };

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

    const shouldDisplayRow = (row, rowIndex) => {
        // Always show header rows
        if (rowIndex === 0 || isGroupHeader(row)) return true;
        const isPackageSelected = selectedPackages.has(row[0]);
        const isGroupCollapsed = collapsedGroups.has(row[0]);
        return isPackageSelected && (!isGroupCollapsed || isGroupHeader(row));
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
        return 6 + (year - baseYear);
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
      
        const totalPackageCost = parseInt(data[headerRowIndex][5], 10);
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
    <>
    <Button onClick={() => setShowChecklistModal(true)}>Filter Packages</Button>
    {renderChecklistModal()}
    <Button onClick={() => setIsDashboardOpen(true)}>Open Dashboard</Button>
    {isDashboardOpen && (
      <Dashboard
        nodes={nodes}
        onAddNode={handleAddNode}
        // onClose={() => (false)}
        updateNodes={setNodes}
      />
    )}
        <table>
        <thead>
            <tr>
                {data[0].map((header, index) => {
                return <th key={index}>{header}</th>;
                })}
            </tr>
        </thead>
        <tbody>
            {filteredData.map((row, rowIndex) => {
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
                        handleSave={handleSave}
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
                            <Button onClick={() => openModal(rowIndex)}>Edit Total Cost</Button>
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
    </>
    );
};

export default CostTable;