// AssetSelector.tsx
import React from "react";
import { AssetSelectorProps } from "../../types/public-types";

const AssetSelector: React.FC<AssetSelectorProps> = ({
  allAssets,
  selectedAssets,
  onToggleAsset,
}) => {
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
                onChange={() => onToggleAsset(assetName)}
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
