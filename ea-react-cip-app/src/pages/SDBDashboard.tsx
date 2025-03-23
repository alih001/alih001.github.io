import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";
import ExcelFileUpload from "../components/sdb_components/SDBFileUpload";
import FilterControls from "../components/sdb_components/FilterControls";
import ScenarioManager from "../components/sdb_components/ScenarioManager";
import AssetSelector from "../components/sdb_components/SDBAssetSelector";
import DemandSupplyChart from "../charts/SDBCharts/SupplyDemandChart";
import CostChart from "../charts/SDBCharts/CostChart";
import { useFilterOptions } from "../hooks/useFilterOptions";
import { useData } from "../contexts/useDataContext";
import { useChartData } from "../hooks/useChartData";
import AssetOverview from "../components/sdb_components/SDBAssetOverview";

import {
  DashboardContainer,
  Header,
  Footer,
  MainContent,
  MainCard,
  ControlsSubCardGrid,
  AssetsSubCardGrid,
  SubCard,
} from "../components/sdb_components/sdb_cards/SDBDashboardStyles";

const HeroSection = styled.section`
  background-position: center, bottom left;
  background-size: cover, cover;
  height: fit-content;
  color: #3c474b;
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
  background-image: url("./src/assets/images/home_page_background.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
`;

const DashboardSection = styled.div`
  background-color: rgba(255, 255, 255, 1);
  border-radius: 15px;
  margin-top: 1.5rem;
`;

const SDBDashboard: React.FC = () => {
  const { filterCriteria, setFilterCriteria, customAssets, selectedAssets } =
    useData();
  const { zones, planningScenarios, growthForecasts } = useFilterOptions();

  // Use the custom hook to get processed chart data.
  const { demandForChart, supplyForChart } = useChartData();

  return (
    <div>
      <Background>
        <DashboardContainer>
          <Header>
            <h1>Supply-Demand Dashboard</h1>
            {/* Global actions can be added here */}
          </Header>

          <MainContent>
            {/* Main Card 1 – Controls */}
            <MainCard>
              <h2>Controls</h2>
              {/* You can have sub-cards within this MainCard */}
              <ControlsSubCardGrid>
                <SubCard>
                  <p>Import your input data here</p>
                  <ExcelFileUpload></ExcelFileUpload>
                </SubCard>
                <SubCard>
                  <p>Scenario Manager</p>
                  <FilterControls
                    criteria={filterCriteria}
                    setCriteria={setFilterCriteria}
                    zones={zones}
                    planningScenarios={planningScenarios}
                    growthForecasts={growthForecasts}
                  />
                </SubCard>

                <SubCard>
                  <p>Asset Selector</p>
                  <AssetSelector
                    allAssets={["Asset1", "Asset2", "Asset3"]} // or dynamically generated
                  />
                </SubCard>

                <SubCard>
                  <p>Scenario Manager</p>
                  <ScenarioManager
                    activeFilterCriteria={filterCriteria}
                    onLoadScenario={(criteria) => setFilterCriteria(criteria)}
                  />
                </SubCard>
              </ControlsSubCardGrid>
            </MainCard>

            {/* Main Card 2 – Charts */}
            <MainCard>
              <h2>Charts</h2>
              <DemandSupplyChart
                demandData={demandForChart}
                supplyData={supplyForChart}
                drought={filterCriteria.drought}
              />
              <CostChart
                customAssets={customAssets}
                selectedAssets={selectedAssets}
              />
            </MainCard>

            {/* Main Card 3 – Asset Overview */}
            <MainCard>
              <h2>Asset Overview</h2>
              <AssetOverview />
            </MainCard>
          </MainContent>

          <Footer>
            <p>Hope it was useful.</p>
          </Footer>
        </DashboardContainer>
      </Background>
    </div>
  );
};

export default SDBDashboard;
