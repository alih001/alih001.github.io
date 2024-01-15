// App.tsx
import React, { useState } from 'react';
import EditableTable from './state_testing/EditableTable';
import './App.css';

const App: React.FC = () => {

  type TableRow = [string, string, number];

  const initialTable1Data: TableRow[] = [
    ["Table 1 - Row 1 Col 1", "Table 1 - Row 1 Col 2", 50],
    ["Table 1 - Row 2 Col 1", "Table 1 - Row 2 Col 2", 20],
  ];

  const initialTable2Data: TableRow[] = [
    ["Table 2 - Row 1 Col 1", "Table 2 - Row 1 Col 2", 30],
    ["Table 2 - Row 2 Col 1", "Table 2 - Row 2 Col 2", 90],
  ];

  const [table1Data, setTable1Data] = useState(initialTable1Data);
  const [table2Data, setTable2Data] = useState(initialTable2Data);
  const [isTable1Visible, setIsTable1Visible] = useState(true);

  return (
    <div className="App">
      <button onClick={() => setIsTable1Visible(!isTable1Visible)}>
        Switch Table
      </button>
      {isTable1Visible ? (
        <>
          <h1>Editable Table 1</h1>
          <EditableTable 
            data={table1Data} 
            onDataChange={setTable1Data}
            tableId = "table1"
          />
        </>
      ) : (
        <>
          <h1>Editable Table 2</h1>
          <EditableTable 
            data={table2Data}
            onDataChange={setTable2Data}
            tableId = "table2"
          />
        </>
      )}
    </div>
  );
};

export default App;
