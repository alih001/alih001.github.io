// costTableSection.tsx
import React, { useState } from 'react';
import { ExpendableButton } from "./costExpendableButton";
import { TableRow } from "./costTableRow";
import useOpenController from "../../Hooks/useOpenController";
import DropdownMenu from "./costDropdownMenu";
import 'bootstrap/dist/css/bootstrap.min.css';

interface VisualDetails {
  "Weir Name": string;
  "Programme Cost": number;
}

interface HiddenDetails {
  "Cost Type": string;

}

interface TableSectionProps {
  visualDetails: VisualDetails;
  hiddenDetails: HiddenDetails;
  index: number;
}

export const CostTableSection: React.FC = ({ weirName, costDetails, index }) => {
  const { isOpen, toggle } = useOpenController(false);
  // const [totalValue, setTotalValue] = useState<number>(visualDetails['Programme Cost']);
  // const [modifiedValue, setModifiedValue] = useState<string>("");
  // const [tdToUpdate, setTdToUpdate] = useState<string>("");

  // const handleDropdownChange = (selectedValue: string) => {
  //   let newValue = "";
  
  //   switch (selectedValue) {
  //     case "Medium":
  //       newValue = "4";
  //       setTdToUpdate(`row${index}_Total`);
  //       break;
  //     case "High":
  //       newValue = "6";
  //       setTdToUpdate(`row${index}_Total`);
  //       break;
  //     default:
  //       newValue = "";
  //       setTdToUpdate("");
  //   }
  //   setModifiedValue(newValue); 
  //   setTdToUpdate(`row${index}_Total`);
  //   setTotalValue(Number(newValue) + Number(visualDetails['Programme Cost']));
  // };

  return (
    <>
      <tr>
        <td>
          <ExpendableButton isOpen={isOpen} toggle={toggle} />
        </td>
        <td>{weirName}</td>
        {/* Add other necessary visible td elements here */}
      </tr>
      {isOpen &&
        costDetails.map((detail, idx) => (
          <tr key={`${index}_${idx}`}>
            <td className='white-background'></td>
            <td>{detail['Cost Type']}</td>
            {/* Render other hidden details of the cost type */}
          </tr>
        ))
      }
    </>
  );
};