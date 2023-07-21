// App.tsx
import React from 'react';
import Navbar from './components/Navbar';
import Header from './components/guideBox';
// import './App.css';

function App() {
  return (
    <div>
      <Navbar />

      <div>
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
      </div>
    </div>
  );
}

export default App;
