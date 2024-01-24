// App.tsx or your main component
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataProvider } from './state_testing/DataContext';
import ResponsiveAppBar from './assets/Navbar';
import './styles/MainPage.css'
import PopulateTables from './state_testing/PopulateTables'

type TableRow = (string | number)[];

const App: React.FC = () => {

return (
  <>
  <DataProvider>  
    <div>
      <ResponsiveAppBar/>
      <PopulateTables/>
    </div>

  </DataProvider>
  </>
  );
};

export default App;