// TableRow.tsx
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <td className = 'white-background'></td>
      <td className = 'white-background'></td>
      <td>{personHeader}</td>
      <td>{shouldUpdateValue ? modifiedValue : value}</td>
      <td className = 'white-background'></td>
    </tr>
  );
};
