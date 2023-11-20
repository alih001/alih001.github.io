// TableSection.tsx
import React, { useState } from 'react';
import { ExpendableButton } from "./ExpendableButton";
import { TableRow } from "./TableRow";
import useOpenController from "../Hooks/useOpenController";
import DropdownMenu from "./DropdownMenu";

interface VisualDetails {
  Weir: string;
  'Cat I Score': number;
  'Cat II Score': number;
  'totalValue': number
}

interface HiddenDetails {
  id: number;
  'Gate Type': string;
  Corrosion: string;
  Erosion: string;
  Scour: string;
  UUID: string;
}

interface TableSectionProps {
  visualDetails: VisualDetails;
  hiddenDetails: HiddenDetails;
  index: number;
}

export const TableSection: React.FC<TableSectionProps> = ({ hiddenDetails, visualDetails, index }) => {
  const { isOpen, toggle } = useOpenController(false);
  const [totalValue, setTotalValue] = useState<number>(visualDetails['totalValue']);
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
    setTotalValue(Number(newValue) + Number(visualDetails['totalValue']));
  };

  return (
    <>
      <tr>
        <td className="button-td">
          <ExpendableButton isOpen={isOpen} toggle={toggle} />
        </td>
        <td>{visualDetails.Weir}</td>
        <td>{visualDetails['Cat I Score']}</td>
        <td>{visualDetails['Cat II Score']}</td>
        <td className = {`row${index}_Total`}>{totalValue}</td>
      </tr>
      {isOpen &&
        Object.entries(hiddenDetails).map(([key, value]) => (
          <TableRow
            key={key}
            personHeader={key}
            value={key === 'Scour' ? <DropdownMenu onOptionChange={handleDropdownChange} /> : value}
            index={index}
            modifiedValue={modifiedValue}
            tdToUpdate={tdToUpdate}
          />
        ))
      }
    </>
  );
};