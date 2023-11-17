// Table.tsx
import React from "react";
import info from "../data/info.json";
import { TableSection } from "./TableSection";

export const Table: React.FC = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Button</th>
          <th>Weir</th>
          <th>Cat Score</th>
          <th>Cat II Score</th>
          <th>Total Value</th>
        </tr>
      </thead>
      <tbody>
        {info.map((personDetails, index) => (
          <TableSection personDetails={personDetails} index={index} key={index} />
        ))}
      </tbody>
    </table>
  );
};
