import React, { useState } from 'react';
import { ExpendableButton } from './assetExpendableButton';
import { TableRow } from './assetTableRow';
import DropdownMenu from './assetDropdownMenu';
import useOpenController from '../../Hooks/useOpenController';
import 'bootstrap/dist/css/bootstrap.min.css';

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

interface AssetTableSectionProps {
  visualDetails: VisualDetails;
  hiddenDetails: HiddenDetails;
  index: number;
  onDropdownChange: (index: number, selectedValue: string) => void;
  dropdownSelections?: string[]; // Include this if you need to track dropdown state
}

export const AssetTableSection: React.FC<AssetTableSectionProps> = ({ 
  visualDetails, 
  hiddenDetails, 
  index, 
  onDropdownChange,
  dropdownSelections // Include this if tracking dropdown state
}) => {
  const { isOpen, toggle } = useOpenController(false);
  const [totalValue, setTotalValue] = useState<number>(visualDetails['Step (I) Score']);
  const [modifiedValue, setModifiedValue] = useState<string>("");
  const [tdToUpdate, setTdToUpdate] = useState<string>("");

  const handleDropdownChange = (selectedValue: string) => {
    let newValue = "";
    // Your logic to calculate newValue based on selectedValue
    // For example:
    // newValue = selectedValue === "Medium" ? "4" : "6";

    setModifiedValue(newValue); 
    setTdToUpdate(`row${index}_Total`);
    setTotalValue(Number(newValue) + Number(visualDetails['Step (I) Score']));
    
    // Notify the Table component about the change
    onDropdownChange(index, selectedValue);
  };

  return (
    <>
      <tr>
        <td>
          <ExpendableButton isOpen={isOpen} toggle={toggle} />
        </td>
        <td>{visualDetails.Weir}</td>
        <td>{visualDetails['Category (I) Score']}</td>
        <td>{visualDetails['Category (II) Score']}</td>
        <td className={`row${index}_Total`}>{totalValue}</td>
      </tr>
      {isOpen && Object.entries(hiddenDetails).map(([key, value]) => (
        <TableRow
          key={key}
          personHeader={key}
          value={key === 'Scour' ?
            <DropdownMenu
              selectedOption={dropdownSelections ? dropdownSelections[index] : ""} 
              onOptionChange={(value) => handleDropdownChange(value)}
            /> : value
          }
          index={index}
          modifiedValue={modifiedValue}
          tdToUpdate={tdToUpdate}
        />
      ))}
    </>
  );
};
