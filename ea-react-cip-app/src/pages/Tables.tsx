// PopulateTables.tsx
import React from 'react';
import { useData } from '../contexts/DataContext';
import ExcelJS from 'exceljs'
import FileUpload from '../components/FileUpload';
import AssetTable from '../components/AssetTable';
import CostTable from '../components/CostTable';
import CustomizedSwitches from '../assets/switch';
import styled from 'styled-components';

const HeroSection = styled.section`
  background-position: center, bottom left;
  background-size: cover, cover;
  height: fit-content;
  color: #3C474B;
  padding: 3rem 23rem 1rem;
  .heroInner {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
  }
  span {
    max-width: 50%;
  }
  h1 {
    font-weight: 900;
    font-size: clamp(2rem, 5.5vw, 3.25rem);
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
`;

const TableSection = styled.div`
background-color: rgba(255, 255, 255, 0.5);
border-radius: 15px;
padding: 6px;
box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(0.5rem);
&:hover {
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
}
width: 95%;
margin-left:2.5rem;
margin-top:1.5rem;
`;

const Background = styled.div`
  background-image: url('./src/assets/images/home_page_background.png');
  background-size: cover;
  background-repeat: no-repeat; 
  background-position: center; 
  min-height: 100vh;
`;

const Tables: React.FC = () => {
  const { table1Data, setTable1Data } = useData();
  const { table2Data, setTable2Data } = useData();
  const { isTable1Visible, setIsTable1Visible } = useData();
  const { setCollapsedAssetRows } = useData();
  const { setCollapsedCostGroups } = useData();

  const handleSwitchChange = () => {
    setIsTable1Visible(prev => !prev); // Toggle the state
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
      <Background>
        <HeroSection className="light hero">
          <div className="heroInner">
            <span>
              <h1>Asset Management</h1>  
            </span>
          </div>
        </HeroSection>
        <FileUpload onFileSelect={handleFileUpload} />
        <CustomizedSwitches 
          onChange={handleSwitchChange} 
          checked={isTable1Visible} 
        />
        <TableSection>
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
        </TableSection>
      </Background>
    </div>

  );
};

export default Tables;
