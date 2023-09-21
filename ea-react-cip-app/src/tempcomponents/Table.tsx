// Table.tsx
import React from "react";
import info from "../data/info.json";
import { TableSection } from "./TableSection";

export const Table: React.FC = () => {
  return (
    <table>
      <thead>
        <tr>
          <td></td>
          <th>Email</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Country</th>
          <th>Alphanumeric</th>
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
