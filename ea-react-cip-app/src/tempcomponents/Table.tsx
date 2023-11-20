// Table.tsx
import React from "react";
import table_json from "../data/collapse_table.json";
import { TableSection } from "./TableSection";


export const Table: React.FC = () => {
  // Define the keys for visual and hidden details
  const visualKeys = ['Weir', 'Cat I Score', 'Cat II Score', 'totalValue'];
  const hiddenKeys = ['id', 'Gate Type', 'Corrosion', 'Erosion', 'Scour', 'UUID'];

  return (
    <table>
        <thead>
        <tr>
          <th>Button</th>
          <th>Weir</th>
          <th>Cat I Score</th>
          <th>Cat II Score</th>
          <th>Total Value</th>
        </tr>
      </thead>
      <tbody>
        {table_json.map((tableDetails, index) => {
          // Filter out visual details
          const visualDetails = visualKeys.reduce((details, key) => {
            if (Object.prototype.hasOwnProperty.call(tableDetails, key)) {
              details[key] = tableDetails[key];
            }
            return details;
          }, {});

          // Filter out hidden details
          const hiddenDetails = hiddenKeys.reduce((details, key) => {
            if (Object.prototype.hasOwnProperty.call(tableDetails, key)) {
              details[key] = tableDetails[key];
            }
            return details;
          }, {});

          return (
            <TableSection
              visualDetails={visualDetails}
              hiddenDetails={hiddenDetails}
              index={index}
              key={index}
            />
          );
        })}
      </tbody>
    </table>
  );
};

