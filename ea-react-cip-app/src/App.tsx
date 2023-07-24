// App.tsx
import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/guideBox';
// import './App.css';
import DefaultBox from './components/sectionBox';
import DefaultContainer from './components/sectionContainer';
import './styles/MainPage.css'
import Grid from '@mui/material/Unstable_Grid2';
import GroupOrientation from './components/buttonGroup';
import CustomizedSwitches from './components/switch';

const App: React.FC = () => {
  return (
    <div>

      <Navbar />

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

        <h1>customise weir rankings</h1>

        <DefaultBox>
          <GroupOrientation/>
          <CustomizedSwitches/>
        </DefaultBox>
      </DefaultContainer>

      <DefaultContainer>
        <Grid container spacing={2}>
          <Grid xs={4}>
              <h1>Top 10 Rankings</h1>
          </Grid>
          <Grid xs={4}>
            <h1>Add Risk Factors</h1>
          </Grid>
        </Grid>

      </DefaultContainer>
    </div>
  );
};

export default App;