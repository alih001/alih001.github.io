// App.tsx or your main component
import React, { useState } from 'react';
import ExcelJS from 'exceljs'
import FileUpload from './state_testing/FileUpload';
import AssetTable from './state_testing/AssetTable';
import CostTable from './state_testing/CostTable';
import 'bootstrap/dist/css/bootstrap.min.css';

import ResponsiveAppBar from './assets/Navbar';
import './styles/MainPage.css'
import CustomizedSwitches from './assets/switch';

type TableRow = (string | number)[];

const App: React.FC = () => {
  const [table1Data, setTable1Data] = useState<TableRow[]>([]);
  const [table2Data, setTable2Data] = useState<TableRow[]>([]);
  const [isTable1Visible, setIsTable1Visible] = useState(true);
  const [dropdownValues, setDropdownValues] = useState<{ [key: string]: string }>({});

  const [collapsedCostGroups, setCollapsedCostGroups] = useState<Set<string>>(
    new Set(table2Data.map(row => row[0]))
  );

  const [collapsedAssetRows, setCollapsedAssetRows] = useState<Set<number>>(
    new Set(table1Data.map((_, rowIndex) => rowIndex).slice(1))  // Exclude header row
  );

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTable1Visible(event.target.checked);
  };

  const readExcelFile = async (file) => {
    const workbook = new ExcelJS.Workbook();
    const arrayBuffer = await file.arrayBuffer();
    await workbook.xlsx.load(arrayBuffer);
  
    const processSheet = (sheet) => {
      let data = [];
      let headers = [];
  
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 0) {
          // Store headers from the first row
          headers = row.values;
        } else {
          // Pushing row values as an array to match the structure used by XLSX
          let rowData = [];
          row.eachCell((cell) => {
            rowData.push(cell.value);
          });
          data.push(rowData);
        }
      });
  
      return data;
    };
  
    const assetInformationSheet = workbook.getWorksheet('AssetInformation');
    const costInformationSheet = workbook.getWorksheet('CostInformation');
    
    const assetInformation = processSheet(assetInformationSheet);
    const costInformation = processSheet(costInformationSheet);
  
    // Set the processed data to your state
    setTable1Data(assetInformation);
    setCollapsedAssetRows(new Set(assetInformation.map((_, rowIndex) => rowIndex).slice(1)));
    setTable2Data(costInformation);
    setCollapsedCostGroups(new Set(costInformation.map(row => row[0])));
  };
  
  // Usage in your file upload handler
  const handleFileUpload = (file: File) => {
    readExcelFile(file);
    // No additional logic needed
  };

return (
  
    <div>
      <ResponsiveAppBar/>

      <h1>Customise weir rankings</h1>
      <FileUpload onFileSelect={handleFileUpload} />
      <CustomizedSwitches 
        onChange={handleSwitchChange} 
        checked={isTable1Visible} 
      />
      {isTable1Visible ? (
        <>
          <h3>Asset Table</h3>
          <AssetTable 
            data={table1Data} 
            onDataChange={setTable1Data} 
            tableId="table1"
            dropdownValues={dropdownValues} 
            setDropdownValues={setDropdownValues}
            collapsedRows={collapsedAssetRows}
            setCollapsedRows={setCollapsedAssetRows} 
          />
        </>
      ) : (
        <>
          <h3>Cost Table</h3>
          <CostTable 
            data={table2Data} 
            onDataChange={setTable2Data} 
            tableId="table2" 
            collapsedGroups={collapsedCostGroups}
            setCollapsedGroups={setCollapsedCostGroups}
          />
        </>
      )}
  </div>
  );
};

export default App;