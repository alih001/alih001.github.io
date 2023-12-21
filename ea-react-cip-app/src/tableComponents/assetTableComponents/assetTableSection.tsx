// TableSection.tsx
import React, { useState } from 'react';
import { ExpendableButton } from "./assetExpendableButton";
import { TableRow } from "./assetTableRow";
import useOpenController from "../../Hooks/useOpenController";
import DropdownMenu from "./assetDropdownMenu";
import 'bootstrap/dist/css/bootstrap.min.css';

interface VisualDetails {
  Weir: string;
  'Category (I) Score': number;
  'Category (II) Score': number;
  'Step (I) Score': number
}

interface HiddenDetails {
  'Gate Type': string;
  Scour: string;
}

interface TableSectionProps {
  visualDetails: VisualDetails;
  hiddenDetails: HiddenDetails;
  index: number;
}

export const AssetTableSection: React.FC<TableSectionProps> = ({ hiddenDetails, visualDetails, index, dropdownSelections, onDropdownChange }) => {
  const { isOpen, toggle } = useOpenController(false);
  const [totalValue, setTotalValue] = useState<number>(visualDetails['Step (I) Score']);
  const [modifiedValue, setModifiedValue] = useState<string>("");
  const [tdToUpdate, setTdToUpdate] = useState<string>("");

  const handleDropdownChange = (selectedValue: string) => {
    let newValue = "";
  
    switch (selectedValue) {
      case "Medium":
        newValue = "4";
        setTdToUpdate(`row${index}_Total`);
        break;
      case "High":
        newValue = "6";
        setTdToUpdate(`row${index}_Total`);
        break;
      default:
        newValue = "";
        setTdToUpdate("");
    }
    setModifiedValue(newValue); 
    setTdToUpdate(`row${index}_Total`);
    setTotalValue(Number(newValue) + Number(visualDetails['Step (I) Score']));
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
        <td className = {`row${index}_Total`}>{totalValue}</td>
      </tr>
      {isOpen &&
        Object.entries(hiddenDetails).map(([key, value]) => (
          <TableRow
            key={key}
            personHeader={key}
            value={key === 'Scour' ?
            <DropdownMenu
              selectedOption={dropdownSelections[index]} 
              onOptionChange={(value) => onDropdownChange(index, value)}
            /> : value
              }
            index={index}
            modifiedValue={modifiedValue}
            tdToUpdate={tdToUpdate}
          />
        ))
      }
    </>
  );
};