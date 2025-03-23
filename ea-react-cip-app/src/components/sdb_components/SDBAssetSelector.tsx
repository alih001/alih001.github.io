// AssetSelector.tsx
import React from "react";
import { useAssetSelector } from "../../hooks/useAssetSelector";
import { AssetSelectorProps } from "../../types/public-types";

const AssetSelector: React.FC<AssetSelectorProps> = ({ allAssets }) => {
  const { selectedAssets, handleToggleAsset } = useAssetSelector();

  return (
    <div>
      <h3>Select Assets to Implement</h3>
      <ul>
        {allAssets.map((assetName) => (
          <li key={assetName}>
            <label>
              <input
                type="checkbox"
                checked={selectedAssets.has(assetName)}
                onChange={() => handleToggleAsset(assetName)}
              />
              {assetName}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetSelector;
