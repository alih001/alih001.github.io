import React from 'react';
import styled from 'styled-components';
import DashboardCardComponent from '../components/custom_components/DashboardCard';
import DashboardPieChart from '../charts/PieChart';
import { useData } from '../contexts/useDataContext';
import DashboardTable from '../charts/summaryTable';

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
    max-width: 80%;
  }
  h1 {
    font-weight: 900;
    font-size: clamp(2rem, 5.5vw, 3.25rem);
    line-height: 1.2;
    margin-bottom: 1.5rem;
  }
`;

const Background = styled.div`
  background-image: url('./src/assets/images/home_page_background.png');
  background-size: cover;
  background-repeat: no-repeat; 
  background-position: center; 
  min-height: 100vh;
`;

const DashboardSection = styled.div`
  border-radius: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 95%;
  min-height: 75vh;
  margin-top:1.5rem;
`;

const AssetDashboard: React.FC = () => {
  const { table1Data } = useData();
  
  return (
    <Background>
      <HeroSection className="light hero">
        <div className="heroInner">
          <span>
          <h1>Assets Dashboard</h1>
          </span>
        </div>
      </HeroSection>
      <DashboardSection>

        <DashboardCardComponent
          title="Top 10 Weir Complexes"
          width = {34} height = {45}
          left = {5} top = {0}
        >
          <DashboardTable tableData={table1Data}/>
        </DashboardCardComponent>

        <DashboardCardComponent
          title="Top 10 Weir Assets"
          width = {34} height = {45}
          left = {5} top = {0}
        >
          <DashboardTable tableData={table1Data}/>
        </DashboardCardComponent>

        <DashboardCardComponent
          title="Weir Type Distribution"
          width = {34} height = {20}
          left = {5} top = {3}
        >
          <DashboardPieChart 
            width={300} height={300} 
            data={table1Data} rowReference={10}/>
        </DashboardCardComponent>

        <DashboardCardComponent
          title="Scour Rating Distribution"
          width = {34} height = {20}
          left = {5} top = {3}
        >
          <DashboardPieChart 
            width={300} height={300} 
            data={table1Data} rowReference={4}/>
        </DashboardCardComponent>

        <DashboardCardComponent
          title="Corrosion Rating Distribution"
          width = {34} height = {20}
          left = {5} top = {3}
        >
          <DashboardPieChart 
            width={300} height={300} 
            data={table1Data} rowReference={6}/>
        </DashboardCardComponent>

        <DashboardCardComponent
          title="Tackle Rating Distribution"
          width = {34} height = {20}
          left = {5} top = {3}
        >
          <DashboardPieChart 
            width={300} height={300} 
            data={table1Data} rowReference={7}/>
        </DashboardCardComponent>
      
      </DashboardSection>
    </Background>
  );
}

export default AssetDashboard;