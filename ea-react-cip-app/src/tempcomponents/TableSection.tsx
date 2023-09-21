// TableSection.tsx
import React, { useState } from 'react';
import { ExpendableButton } from "./ExpendableButton";
import { TableRow } from "./TableRow";
import useOpenController from "../Hooks/useOpenController";
import DropdownMenu from "./DropdownMenu";

interface PersonDetails {
  id: number;
  name: string;
  phone: string;
  email: string;
  country: string;
  alphanumeric: string;
}

interface TableSectionProps {
  personDetails: PersonDetails;
  index: number;
}

export const TableSection: React.FC<TableSectionProps> = ({ personDetails, index }) => {
  const { isOpen, toggle } = useOpenController(false);
  const personDetailKeys = Object.keys(personDetails);
  const [modifiedValue, setModifiedValue] = useState<string>("");
  const [tdToUpdate, setTdToUpdate] = useState<string>("");
  const [totalValue, setTotalValue] = useState<number>(10);

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
  
    setTotalValue(Number(newValue) + 10);
  };

  return (
    <tbody>
      <tr>
        <td className="button-td">
          <ExpendableButton isOpen={isOpen} toggle={toggle} />
        </td>
        <td>Person : {index}</td>
        <td>yo{index}</td>
        <td>yoyo{index}</td>
        <td id={`row${index}_Total`}>{totalValue}</td>
      </tr>
      {isOpen &&
    personDetailKeys.map((key) => (
    <TableRow
        key={key}
        personHeader={key}
        index={index}
        tdToUpdate={tdToUpdate}
        modifiedValue={modifiedValue}
        personDetails={key === 'country' ? <DropdownMenu onOptionChange={handleDropdownChange} /> : personDetails[key]}
    />
))}
    </tbody>
  );
};
