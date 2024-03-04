import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataProvider } from './contexts/DataContext';
import CustomSidebar from './components/custom_components/Navbar';
import './styles/MainPage.css';
import AppRoutes from './routes';
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', height: '100vh' }}>
          <CustomSidebar/>
          <div style={{ flex: 1 }}>
            <AppRoutes/>
          </div>
        </div>
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
