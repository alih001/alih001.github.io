// App.tsx or your main component
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './state_testing/FileUpload';
import AssetTable from './state_testing/AssetTable';
import CostTable from './state_testing/CostTable';
import 'bootstrap/dist/css/bootstrap.min.css';

import ResponsiveAppBar from './components/Navbar';
import Header from './components/guideBox';
import DefaultBox from './components/sectionBox';
import DefaultContainer from './components/sectionContainer';
import './styles/MainPage.css'
import Grid from '@mui/material/Unstable_Grid2';
import CustomizedSwitches from './components/switch';

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

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const assetInformation: TableRow[] = XLSX.utils.sheet_to_json(workbook.Sheets['AssetInformation'], { header: 1 });
        const costInformation: TableRow[] = XLSX.utils.sheet_to_json(workbook.Sheets['CostInformation'], { header: 1 });
        
        setTable1Data(assetInformation);
        setCollapsedAssetRows(new Set(assetInformation.map((_, rowIndex) => rowIndex).slice(1)));
    
        setTable2Data(costInformation);
        setCollapsedCostGroups(new Set(costInformation.map(row => row[0])));
      
      }
    };
    reader.readAsBinaryString(file);
  };

return (
  
    <div>
      <ResponsiveAppBar/>

      <DefaultContainer>
        <Header
          className="MainHeader" 
          imageSrc="../src/assets/images/thinking.png"
          title="Purpose" 
          description="This app is designed to replace the existing weir ranking spreadsheet. 
          It allows a user to import a spreadsheet and edit any details to produce a top 10 ranking table."
        />
        <Header
          className="SubHeader" 
          imageSrc="../src/assets/images/upload.png" 
          title="Step 1" 
          description="Load in Data"
          imageSrc2='../src/assets/images/recovery.png'
          title2='Step 2'
          description2='Customise Settings'
        />
        <Header
          className="SubHeader" 
          imageSrc="../src/assets/images/maths.png" 
          title="Step 3" 
          description="Add some factors"
          imageSrc2='../src/assets/images/podium.png'
          title2='Step 4'
          description2='Rank your weirs'
        />
      </DefaultContainer>

      <DefaultContainer>

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
      </DefaultContainer>
  </div>
  );
};

export default App;
