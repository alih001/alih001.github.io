// AssetOverview.tsx
import React from "react";
import styled from "styled-components";
import { useData } from "../../contexts/useDataContext";
import AssetCard from "./sdb_cards/SDBAssetCard";

const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
  gap: 1rem;
`;

// const AssetCard = styled.div`
//   padding: 1rem;
//   background: #f9f9f9;
//   border: 1px solid #ddd;
//   border-radius: 4px;
// `;

const AssetOverview: React.FC = () => {
  const { selectedAssets } = useData();
  const assets = Array.from(selectedAssets);

  if (assets.length === 0) {
    return <div>No assets selected.</div>;
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
