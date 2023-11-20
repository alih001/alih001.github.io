// App.tsx
import React from 'react';
import { Table } from './tempcomponents/Table';
import ExcelToJson from './tempcomponents/ExcelToJson';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/tableStyles.css'

function App() {
  return (
    <div className='App'>
      <div className='container'>
        <Table />
      </div>
      <div>
        <h1>Excel to JSON Converter</h1>
        <ExcelToJson />
    </div>
    </div>
  );
}

export default App;
