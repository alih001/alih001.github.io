// Importing Bootstrap CSS in a TypeScript file
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { ChangeEvent, useState } from 'react';
import * as XLSX from 'xlsx';

interface ExcelToJsonProps {}

const ExcelToJson: React.FC<ExcelToJsonProps> = () => {
  // Define the state with TypeScript type
  const [jsonData, setJsonData] = useState<any[]>([]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target?.result;
      if (data) {
        const workBook = XLSX.read(data, { type: 'binary' });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const json = XLSX.utils.sheet_to_json(workSheet);
        setJsonData(json);
      }
    };

    reader.readAsBinaryString(files[0]);
  };

  const renderTableHeader = () => {
    if (jsonData.length === 0) return null;

    const headerKeys = Object.keys(jsonData[0]);
    return (
      <tr>
        {headerKeys.map((key, index) => (
          <th key={index}>{key}</th>
        ))}
      </tr>
    );
  };

  const renderTableRows = () => {
    return jsonData.map((row, index) => (
      <tr key={index}>
        {Object.values(row).map((cell, index) => (
          <td key={index}>{cell}</td>
        ))}
      </tr>
    ));
  };


  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />
      {jsonData && jsonData.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="thead-dark">
              {renderTableHeader()}
            </thead>
            <tbody>
              {renderTableRows()}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelToJson;