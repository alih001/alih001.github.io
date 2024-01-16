// App.tsx or your main component
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './state_testing/FileUpload'; // Import your FileUpload component
import EditableTable from './state_testing/EditableTable'; // Import your EditableTable component

type TableRow = (string | number)[]; // Adjust this type according to your actual data structure

const App: React.FC = () => {
  const [table1Data, setTable1Data] = useState<TableRow[]>([]);
  const [table2Data, setTable2Data] = useState<TableRow[]>([]);
  const [isTable1Visible, setIsTable1Visible] = useState(true);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      if (event.target && event.target.result) {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const assetInformation: TableRow[] = XLSX.utils.sheet_to_json(workbook.Sheets['AssetInformation'], { header: 1 });
        const costInformation: TableRow[] = XLSX.utils.sheet_to_json(workbook.Sheets['CostInformation'], { header: 1 });

        setTable1Data(assetInformation);
        setTable2Data(costInformation);
      }
    };
    reader.readAsBinaryString(file);
  };

return (
    <div>
      <FileUpload onFileSelect={handleFileUpload} />
      <button onClick={() => setIsTable1Visible(!isTable1Visible)}>
        Switch Table
      </button>
      {isTable1Visible ? (
        <>
          <h1>Editable Table 1</h1>
          <EditableTable 
            data={table1Data} 
            onDataChange={setTable1Data} 
            tableId="table1"
            collapsibleColumns={['Scour Rating', 'Corrosion Rating']} 
          />
        </>
      ) : (
        <>
          <h1>Editable Table 2</h1>
          <EditableTable 
            data={table2Data} 
            onDataChange={setTable2Data} 
            tableId="table2" 
          />
        </>
      )}
  </div>
  );
};

export default App;
