import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
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
import WRZTabs from "../components/sdb_components/SDBWRZTabs";
import WhatIfModal from "../components/sdb_components/SDBWhatIfModal";
import BaseCard from "../components/sdb_components/sdb_cards/SDBBaseCard";

// Global styles for fonts, background, etc.
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background: #f4f7fa;
    color: #333;
  }
`;

// Overall dashboard layout using CSS Grid with 3 columns
const DashboardContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
`;

// Header styles remain unchanged
const Header = styled.header`
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

// Footer styles remain unchanged
const Footer = styled.footer`
  background: #fff;
  border-top: 1px solid #e5e5e5;
  padding: 1rem 2rem;
  text-align: center;
`;

// Main content area divided into 3 columns: controls, charts, and asset overview
const MainContent = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr 1fr;
  gap: 16px;
  padding: 16px 2rem;
`;

// Side panel for controls such as file upload, filtering, and scenario management
const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Dashboard = () => {
  const { filterCriteria, setFilterCriteria, customAssets } = useData();
  const [showWhatIfModal, setShowWhatIfModal] = useState(false);
  const { activeWRZ, assetToWRZMap } = useData();
  const allAssets = assetToWRZMap[activeWRZ] || [];
  const { zones, planningScenarios, growthForecasts } = useFilterOptions();
  const { demandForChart, supplyForChart, simulatedDemandForChart } =
    useChartData();

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <Header>
          <h1>Supply-Demand Dashboard</h1>
          {/* Additional header actions can go here */}
        </Header>
        <MainContent>
          {/* Column 1: Side Panel with controls */}
          <SidePanel>
            <BaseCard>
              <h3>Data Import</h3>
              <ExcelFileUpload />
            </BaseCard>
            <BaseCard>
              <h3>Filter Controls</h3>
              <FilterControls
                criteria={filterCriteria}
                setCriteria={setFilterCriteria}
                zones={zones}
                planningScenarios={planningScenarios}
                growthForecasts={growthForecasts}
              />
            </BaseCard>
            <BaseCard>
              <h3>Asset Selector</h3>
              <AssetSelector allAssets={allAssets} />
            </BaseCard>
            <BaseCard>
              <h3>Scenario Manager</h3>
              <ScenarioManager
                activeFilterCriteria={filterCriteria}
                onLoadScenario={(criteria) => setFilterCriteria(criteria)}
              />
            </BaseCard>
            <BaseCard>
              <h3>What-If Simulator</h3>
              <Button onClick={() => setShowWhatIfModal(true)}>
                Open Simulator
              </Button>
            </BaseCard>
          </SidePanel>
          {/* Column 2: Charts */}
          <BaseCard>
            <h3>Charts</h3>
            <WRZTabs />
            <DemandSupplyChart
              demandData={demandForChart}
              supplyData={supplyForChart}
              simulatedDemandData={simulatedDemandForChart}
              drought={filterCriteria.drought}
            />
            <CostChart customAssets={customAssets} />
          </BaseCard>
          {/* Column 3: Asset Overview */}
          <BaseCard>
            <h3>Asset Overview</h3>
            <AssetOverview />
          </BaseCard>
          {showWhatIfModal && (
            <WhatIfModal onClose={() => setShowWhatIfModal(false)} />
          )}
        </MainContent>
        <Footer>
          <p>Hope it was useful.</p>
        </Footer>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
