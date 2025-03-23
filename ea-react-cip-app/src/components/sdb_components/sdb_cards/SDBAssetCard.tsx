// AssetCard.tsx
import React from "react";
import { useAssetSetting } from "../../../hooks/useAssetSetting";

interface AssetCardProps {
  assetName: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ assetName }) => {
  const { currentSettings, updateDOPercentage, updateStartYear } =
    useAssetSetting(assetName);

  return (
    <div>
      <h4>{assetName}</h4>
      <div>
        <label>
          DO Percentage: {currentSettings.doPercentage}%
          <input
            type="range"
            min="0"
            max="100"
            value={currentSettings.doPercentage}
            onChange={(e) => updateDOPercentage(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Start Year:
          <input
            type="number"
            value={currentSettings.startYear}
            onChange={(e) => updateStartYear(Number(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
};

export default AssetCard;
