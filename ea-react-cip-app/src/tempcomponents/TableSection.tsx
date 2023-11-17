// TableSection.tsx
import React, { useState } from 'react';
import { ExpendableButton } from "./ExpendableButton";
import { TableRow } from "./TableRow";
import useOpenController from "../Hooks/useOpenController";
import DropdownMenu from "./DropdownMenu";

interface PersonDetails {
  id: number;
  'Gate Type': string;
  Corrosion: string;
  Erosion: string;
  Scour: string;
  UUID: string;
}

interface TableSectionProps {
  personDetails: PersonDetails;
  index: number;
}

export const TableSection: React.FC<TableSectionProps> = ({ personDetails, index }) => {
  const { isOpen, toggle } = useOpenController(false);
  const [totalValue, setTotalValue] = useState<number>(10);
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
    setTotalValue(Number(newValue) + 10);
  };

  return (
    <>
      <tr>
        <td className="button-td">
          <ExpendableButton isOpen={isOpen} toggle={toggle} />
        </td>
        <td>Weir : {index}</td>
        <td>Weir {index} Cat I Score</td>
        <td>Weir {index} Cat II Score</td>
        <td>{totalValue}</td>
      </tr>
      {isOpen &&
        Object.entries(personDetails).map(([key, value]) => (
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