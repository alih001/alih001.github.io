import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import DataImportButton from "../components/sdb_components/SDBFileUpload";
import FilterControls from "../components/sdb_components/FilterControls";
import AssetSelectorButton from "../components/sdb_components/SDBAssetSelectorButton";
import ScenarioManagerButton from "../components/sdb_components/SDBScenarioManagerContent";
import WhatIfButton from "../components/sdb_components/SDBWhatIfButton";
import DemandSupplyChart from "../charts/SDBCharts/SupplyDemandChart";
import CostChart from "../charts/SDBCharts/CostChart";
import { useFilterOptions } from "../hooks/useFilterOptions";
import { useData } from "../contexts/useDataContext";
import { useChartData } from "../hooks/useChartData";
import AssetOverview from "../components/sdb_components/SDBAssetOverview";
import WRZTabs from "../components/sdb_components/SDBWRZTabs";
import WhatIfModal from "../components/sdb_components/SDBWhatIfModal";
import BaseCard from "../components/sdb_components/sdb_cards/SDBBaseCard";
import { EmptyStateMessage } from "../components/custom_components/EmptyComponent";
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

const DataImportWrapper = styled.div`
  width: 100%;
  /* Optionally mimic BaseCard padding */
  padding: 16px;
`;

// Main content area divided into 3 columns: controls, charts, and asset overview
const MainContent = styled.main`
  display: grid;
  grid-template-columns: 300px 1fr 1fr;
  gap: 16px;
  padding: 16px 2rem;
`;

// A new container for controls with consistent spacing.
const ControlsContainer = styled.div`
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
        <MainContent>
          {/* Column 1: Side Panel with controls */}
          <ControlsContainer>
            <DataImportWrapper>
              <DataImportButton />
            </DataImportWrapper>
            <FilterControls
              criteria={filterCriteria}
              setCriteria={setFilterCriteria}
              zones={zones}
              planningScenarios={planningScenarios}
              growthForecasts={growthForecasts}
            />
            <AssetSelectorButton allAssets={allAssets} />
            <ScenarioManagerButton />
            <WhatIfButton />
          </ControlsContainer>

          {/* Column 2: Charts */}
          <BaseCard>
            {demandForChart && supplyForChart ? (
              <>
                <WRZTabs />
                <DemandSupplyChart
                  demandData={demandForChart}
                  supplyData={supplyForChart}
                  simulatedDemandData={simulatedDemandForChart}
                  drought={filterCriteria.drought}
                />
                <CostChart customAssets={customAssets} />
              </>
            ) : (
              <EmptyStateMessage message="No data available." />
            )}
          </BaseCard>

          {/* Column 3: Asset Overview */}
          <BaseCard>
            <AssetOverview />
          </BaseCard>
          {showWhatIfModal && (
            <WhatIfModal onClose={() => setShowWhatIfModal(false)} />
          )}
        </MainContent>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
