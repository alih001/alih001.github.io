import React from 'react';
import styled from 'styled-components';
import DashboardCardComponent from '../components/DashboardCard';
import DashboardPieChart from '../charts/BarChart';

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
  margin-left:2.5rem;
  margin-top:1.5rem;
`;

const AssetDashboard: React.FC = () => (
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
        width = {34} height = {20}
        left = {5} top = {3}
      >
        <DashboardPieChart width={350} height={350}/>
      </DashboardCardComponent>

      <DashboardCardComponent
        title="Top 10 Weir Assets"
        width = {34} height = {20}
        left = {5} top = {3}
      >
        <DashboardPieChart width={350} height={350}/>
      </DashboardCardComponent>

      <DashboardCardComponent
        title="Scour, Corrosion and Tackle Rating Distribution"
        width = {34} height = {20}
        left = {5} top = {3}
      >
        <DashboardPieChart width={350} height={350}/>
      </DashboardCardComponent>

      <DashboardCardComponent
        title="Average Scores by Weir Type"
        width = {34} height = {20}
        left = {5} top = {3}
      >
        <DashboardPieChart width={350} height={350}/>
      </DashboardCardComponent>

      <DashboardCardComponent
        title="Total Scores Distribution"
        width = {34} height = {20}
        left = {5} top = {3}
      >
        <DashboardPieChart width={350} height={350}/>
      </DashboardCardComponent>

      <DashboardCardComponent
        title="Filter and Search"
        width = {34} height = {20}
        left = {5} top = {3}
      >
        <DashboardPieChart width={350} height={350}/>
      </DashboardCardComponent>

    
    </DashboardSection>
	</Background>
);

export default AssetDashboard;