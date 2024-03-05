// CostTable.tsx
import React, { useEffect, useMemo } from 'react';
import '../../styles/tableStyles.css';
import CustomModal from '../custom_components/CustomModal';
import { Button, Modal } from 'react-bootstrap';
import { useData } from '../../contexts/useDataContext';
import { TableCell as CostTableCell, CostTableProps, CostTableRow, CostTableData } from '../../types/public-types';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const CostTable: React.FC<CostTableProps> = ({
    data, onDataChange, tableId,
  }) => {

    const packageOptions = useMemo(() => {
        // Extract unique package names from data
        const packages = new Set(data.map(row => row[0]));
        return Array.from(packages);
      }, [data]);

    const {
      showModal, setShowModal, sliderValue, setSliderValue, editingRowIndex, setEditingRowIndex,
      selectedPackages, setSelectedPackages, showChecklistModal, setShowChecklistModal, collapsedCostGroups, setCollapsedCostGroups
          } = useData();

    useEffect(() => {
        // Initialize selected packages only once
        const allPackages = new Set(data.map(row => row[0]));
        setSelectedPackages(allPackages);
    }, [data, setSelectedPackages]);
    
    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }
  
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;    
      const numericValue = Number(newValue);
      setSliderValue(numericValue);
    };
      
    const openModal = (rowIndex: number) => {
      setEditingRowIndex(rowIndex);
      setShowModal(true);
    };
  
    const closeModal = () => {
      setShowModal(false);
      setEditingRowIndex(null);
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
                    checked={selectedPackages.has(numToStringTypeConverter(packageName))}
                    onChange={(e) => handlePackageCheckChange(numToStringTypeConverter(packageName), e.target.checked)}
                  />
                  {packageName}
                </div>
              ))}
            </div>
            <Button variant="primary" onClick={handleModalClose}>Apply Filter</Button>
          </Modal>
        );
      };
      

    const handlePackageCheckChange = (packageName: string, isChecked: boolean) => {
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

            const updatedData = [...data];

            for (let i = 1; i <= 3; i++) {
              if (rowIndex + i < updatedData.length) {
                const updatedPackageSplit = stringToNumTypeConverter(updatedData[rowIndex + i][4])
                updatedData[rowIndex + i][5] = (totalPackageCost * updatedPackageSplit) / 100;
                const updatedPackageCost = updatedData[rowIndex+i][5]
                const updatedRow = shiftRowDataForDuration(updatedData[rowIndex+i], updatedPackageCost, updatedData[rowIndex+i][3], updatedData[rowIndex+i][2]);
                updatedData[rowIndex + i] = updatedRow as CostTableRow;
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
    const isGroupHeader = (row: CostTableRow) => {
        return row[1].includes("Package Summary");
        };

    // Function to toggle group collapse state
    const toggleGroup = (groupName: string) => {
        setCollapsedCostGroups(prev => {
        const newCollapsedGroups = new Set(prev);
        if (newCollapsedGroups.has(groupName)) {
            newCollapsedGroups.delete(groupName);
        } else {
            newCollapsedGroups.add(groupName);
        }
        return newCollapsedGroups;
        });
    };

    const shouldDisplayRow = (row: CostTableRow, rowIndex: number) => {
        // Always show header rows
        if (rowIndex === 0 || isGroupHeader(row)) return true;
        const isPackageSelected = selectedPackages.has(row[0]);
        const isGroupCollapsed = collapsedCostGroups.has(row[0]);
        return isPackageSelected && (!isGroupCollapsed || isGroupHeader(row));
      };
      

    const handleYearChange = (rowIndex: number, colIndex: number, newValue: string) => {
        const newYear = parseInt(newValue, 10);
        const updatedRow = shiftRowDataForYear(data[rowIndex], newYear);
        
        const updatedData = [...data];
        updatedData[rowIndex] = updatedRow as CostTableRow;
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

    const shiftRowDataForYear = (row: CostTableRow, startYear: number) => {
        const columnIndex = yearToColumnIndex(startYear);
        const newRow = row.slice(6).filter(value => value !== 0 && value !== "-");
      
        const updatedRow = [...row];

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
      
    const renderYearDropdown = (rowIndex: number, colIndex: number, currentValue: number) => {
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

    const shiftRowDataForDuration = (row: CostTableRow, currentTotal: number, newDuration: number, startYear: number) => {

        const assignedValue = Math.round(currentTotal / newDuration)
        const columnIndex = yearToColumnIndex(startYear);
      
        const updatedRow = [...row];

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

    const stringToNumTypeConverter = (value: string | number) => {
      const convertedValue = typeof value === 'string' ? parseFloat(value) : value;

      return convertedValue
    }

    const numToStringTypeConverter = (value: string | number): string => {
      const convertedValue = typeof value === 'number' ? value.toString() : value;
    
      return convertedValue;
    }
    
    const handleDurationChange = (rowIndex: number, colIndex: number, newValue: number) => {
        const currentTotal = data[rowIndex][5]
        const startYear = data[rowIndex][2]

        const updatedRow = shiftRowDataForDuration(data[rowIndex], currentTotal, newValue, startYear);

        const updatedData = [...data];
        updatedData[rowIndex] = updatedRow as CostTableRow;
        updatedData[rowIndex][colIndex] = newValue;
        onDataChange(updatedData);
        updateTotalCosts(rowIndex, updatedData)
      };

    const renderDurationDropdown = (rowIndex: number, colIndex: number, currentValue: number) => {
        return (
        <select
            value={currentValue}
            onChange={(e) => handleDurationChange(rowIndex, colIndex, stringToNumTypeConverter(e.target.value))}
        >
            {startDurationOptions.map(duration => (
            <option key={duration} value={duration}>{duration}</option>
            ))}
        </select>
        );
    };

    const handleCostSplitChange = (rowIndex: number, _colIndex: number, newValue: number) => {
        const sliderValue = newValue
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
      
        const totalPackageCost = data[headerRowIndex][5];
        const newPackageCost = (totalPackageCost * sliderValue) / 100;
      
        // Update the data
        const updatedData = [...data];
        updatedData[rowIndex][4] = newValue; // Update package cost for this row
        updatedData[rowIndex][5] = newPackageCost; // Update package cost for this row

        // Update Duration Split with new Cost Split
        const updatedRow = shiftRowDataForDuration(updatedData[rowIndex], 
                                                   newPackageCost, 
                                                   updatedData[rowIndex][3], 
                                                   updatedData[rowIndex][2],
                                                   );

        updatedData[rowIndex] = updatedRow as CostTableRow;
        onDataChange(updatedData);

        updateTotalCosts(rowIndex, updatedData)

      };
      
    const updateTotalCosts = (rowIndex:number, updatedData: CostTableData) => {
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
            const feasibilityValue = stringToNumTypeConverter(feasibilityRow[colIndex]) || 0;
            const designValue = stringToNumTypeConverter(designRow[colIndex]) || 0;
            const constructionValue = stringToNumTypeConverter(constructionRow[colIndex]) || 0;

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
            onChange={(e) => handleCostSplitChange(rowIndex, colIndex, stringToNumTypeConverter(e.target.value))}
          />
        );
      };
      
    const renderCellContent = (row: CostTableRow, rowIndex: number, colIndex: number, cell: CostTableCell) => {
        if (colIndex === 2 && !isGroupHeader(row)) {
            return renderYearDropdown(rowIndex, colIndex, stringToNumTypeConverter(cell));
        } else if (colIndex === 3 && !isGroupHeader(row)) {
            return renderDurationDropdown(rowIndex, colIndex, stringToNumTypeConverter(cell));
        } else if (colIndex === 4 && !isGroupHeader(row)) {
            return rendercostSplitSlider(rowIndex, colIndex, stringToNumTypeConverter(cell));
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {data[0].map((header, index) => {
              return <TableCell key={index}>{header}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
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
                <TableRow>
                  {/* Render cells */}
                  {row.map((cell, colIndex) => (
                      <TableCell key={`${tableId}-${rowIndex}-${colIndex}`}>
                          {renderCellContent(row, rowIndex, colIndex, cell)}
                      </TableCell>
                  ))}

                  {/* Toggle button for group headers */}
                  {isGroupHeader(row) && (
                  <>
                  <TableCell>
                      <button onClick={() => toggleGroup(row[0])}>
                      {collapsedCostGroups.has(row[0]) ? 'Expand' : 'Collapse'}
                      </button>
                  </TableCell>
                  <TableCell>
                      <Button onClick={() => openModal(rowIndex)}>Edit Total Cost</Button>
                  </TableCell>
                  </>
                  )}
                </TableRow>
              </>
              )}
              {/* ... [rest of the row rendering logic] */}
              </React.Fragment>
            );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
    );
};

export default CostTable;