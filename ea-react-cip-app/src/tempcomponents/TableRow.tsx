// TableRow.tsx
import React from "react";

interface TableRowProps {
  personHeader: string;
  value: string | React.ReactNode;
  index: number;
  modifiedValue: string;
  tdToUpdate: string;
}

export const TableRow: React.FC<TableRowProps> = ({ personHeader, value, index, modifiedValue, tdToUpdate }) => {
  const shouldUpdateValue = `row${index}_value${personHeader}` === tdToUpdate;

  return (
    <tr>
      <td></td>
      <td></td>
      <td>{personHeader}</td>
      <td>{shouldUpdateValue ? modifiedValue : value}</td>
      <td></td>
    </tr>
  );
};
