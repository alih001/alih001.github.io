// App.tsx
import React from 'react';
import { Table } from './tempcomponents/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/tableStyles.css'

function App() {
  return (
    <div className='App'>
      <div className='container'>
        <Table />
      </div>
    </div>
  );
}

export default App;
