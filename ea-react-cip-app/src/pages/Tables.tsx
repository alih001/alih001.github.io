// PopulateTables.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import ExcelJS from 'exceljs'
import FileUpload from '../components/FileUpload';
import AssetTable from '../components/AssetTable';
import CostTable from '../components/CostTable';
import CustomizedSwitches from '../assets/switch';

const Tables: React.FC = () => {
  const { table1Data, setTable1Data } = useData();
  const { table2Data, setTable2Data } = useData();
  const { isTable1Visible, setIsTable1Visible } = useData();
  const { setCollapsedAssetRows } = useData();
  const { setCollapsedCostGroups } = useData();

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
  
    setTable1Data(assetInformation);
    setCollapsedAssetRows(new Set(assetInformation.map((_, rowIndex) => rowIndex).slice(1)));
    setTable2Data(costInformation);
    setCollapsedCostGroups(new Set(costInformation.map(row => row[0])));
  };
  
  // file upload handler
  const handleFileUpload = (file: File) => {
    readExcelFile(file);
  };

  return (
    <div>
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
            />
            </>
        ) : (
            <>
            <h3>Cost Table</h3>
            <CostTable 
                data={table2Data} 
                onDataChange={setTable2Data} 
                tableId="table2" 
            />
            </>
        )}
  </div>

  );
};

export default Tables;
