import React from 'react';
import { AssetTableSection } from './assetTableComponents/assetTableSection';
// import CostTableSection from './CostTableSection'; // Uncomment if using CostTableSection

interface VisualDetails {
  Weir: string;
  'Category (I) Score': number;
  'Category (II) Score': number;
  'Step (I) Score': number;
}

interface HiddenDetails {
  'Gate Type': string;
  Scour: string;
}

interface TableProps {
  data: Array<{ visualDetails: VisualDetails; hiddenDetails: HiddenDetails }>;
  onDataChange: (newData: Array<{ visualDetails: VisualDetails; hiddenDetails: HiddenDetails }>) => void;
}

const Table: React.FC<TableProps> = ({ data, onDataChange }) => {

  const handleDropdownChange = (index: number, selectedValue: string) => {
    // Implement logic to modify data based on dropdown change
    // Example:
    const newData = data.map((item, idx) => {
      if (index === idx) {
        // Modify item based on selectedValue
        // Example: Update 'Gate Type' or 'Scour' value in hiddenDetails
      }
      return item;
    });

    onDataChange(newData);
  };

  return (
    <table>
      <tbody>
        {data.map((item, index) => (
          <AssetTableSection
            key={index}
            visualDetails={item.visualDetails}
            hiddenDetails={item.hiddenDetails}
            index={index}
            onDropdownChange={handleDropdownChange}
            dropdownSelections={...} // Pass if needed for initial dropdown state
          />
          // Uncomment and use CostTableSection if needed
          // <CostTableSection
          //   key={index}
          //   weirName={...}
          //   costDetails={...}
          //   index={index}
          //   // Other necessary props
          // />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
