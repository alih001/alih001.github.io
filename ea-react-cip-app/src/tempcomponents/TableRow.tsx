// TableRow.tsx
import React from "react";

interface TableRowProps {
  personHeader: string;
  index: number;
  tdToUpdate?: string;
  modifiedValue: string | React.ReactNode;
  personDetails: string | React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = (props) => {
  const tdIdPart = props.tdToUpdate && props.tdToUpdate.split("_")[1]?.split("value")[1];

  return (
    <tr>
      <td id={`row${props.index}_header${props.personHeader}`}>{props.personHeader}</td>
      <td id={`row${props.index}_value${props.personHeader}`}>
        {
          props.personHeader === tdIdPart
            ? props.modifiedValue 
            : props.personDetails
        }
      </td>
    </tr>
  );
};
