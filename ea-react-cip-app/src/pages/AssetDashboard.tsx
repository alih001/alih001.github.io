// src/pages/AssetDashboard.tsx
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { EmptyStateMessage } from "../components/custom_components/EmptyComponent";
import { useData } from "../contexts/useDataContext";
import AssetDisplayCard from "../components/sdb_components/sdb_cards/SDBAssetsDashboardCard";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background: #f4f7fa;
    color: #333;
  }
`;

const DashboardContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
`;

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const Dashboard: React.FC = () => {
  const { assetDetailsMap } = useData();

  if (!assetDetailsMap || Object.keys(assetDetailsMap).length === 0) {
    return <EmptyStateMessage message="No assets available." />;
  }

  return (
    <>
      <GlobalStyle />
      <DashboardContainer>
        <OverviewGrid>
          {Object.entries(assetDetailsMap).map(([assetName, assetData]) => (
            <AssetDisplayCard
              key={assetName}
              assetName={assetName}
              assetData={assetData}
            />
          ))}
        </OverviewGrid>
      </DashboardContainer>
    </>
  );
};

export default Dashboard;
