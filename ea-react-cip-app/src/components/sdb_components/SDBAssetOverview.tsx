import React from "react";
import styled from "styled-components";
import { useData } from "../../contexts/useDataContext";
import AssetCard from "./sdb_cards/SDBAssetCard";

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
  gap: 1rem;
`;

const SDBAssetCard = styled.div`
  padding: 1rem;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const AssetOverview: React.FC = () => {
  const { getCurrentWRZState } = useData();
  const { selectedAssets } = getCurrentWRZState();

  const assets = Array.from(selectedAssets).sort();

  if (assets.length === 0) {
    return <div>No assets selected.</div>;
  }

  return (
    <OverviewGrid>
      {assets.map((asset) => (
        <SDBAssetCard key={asset}>
          <AssetCard assetName={asset} />
        </SDBAssetCard>
      ))}
    </OverviewGrid>
  );
};

export default AssetOverview;
