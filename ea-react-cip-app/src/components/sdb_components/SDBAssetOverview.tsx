import React from "react";
import styled from "styled-components";
import { useData } from "../../contexts/useDataContext";
import AssetCard from "./sdb_cards/SDBAssetCard";
import { EmptyStateMessage } from "../custom_components/EmptyComponent";

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const AssetOverview: React.FC = () => {
  const { getCurrentWRZState } = useData();
  const { selectedAssets } = getCurrentWRZState();
  const assets = Array.from(selectedAssets).sort();

  if (assets.length === 0) {
    return <EmptyStateMessage message="No assets selected." />;
  }

  return (
    <OverviewGrid>
      {assets.map((asset) => (
        <AssetCard key={asset} assetName={asset} />
      ))}
    </OverviewGrid>
  );
};

export default AssetOverview;
