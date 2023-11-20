// Table.tsx
import React, { useState } from "react";
import { TableSection } from "./TableSection";
import * as XLSX from 'xlsx';

export const Table: React.FC = () => {
  const [tableData, setTableData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    parseExcel(file);
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setTableData(json);
    };
    reader.readAsBinaryString(file);
  };
  

  const visualKeys = ['Weir', 'Category (I) Score', 'Category (II) Score', 'Step (I) Score'];
  const hiddenKeys = ['Gate Type', 'Scour'];

  return (
    <>
    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
    <table className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
        <tr>
          <th></th>
          <th>Weir</th>
          <th>Cat I Score</th>
          <th>Cat II Score</th>
          <th>Total Value</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((tableDetails, index) => {
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
    </>
  );
};

