// AssetSelector.tsx
import React, { useState } from "react";
import { useAssetSelector } from "../../hooks/useAssetSelector";
import { AssetSelectorProps } from "../../types/public-types";
import SDBModal from "./sdb_cards/SDBModal";

const AssetSelector: React.FC<AssetSelectorProps> = ({ allAssets }) => {
  const { selectedAssets, handleToggleAsset } = useAssetSelector();
  const [showSDBModal, setSDBShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setSDBShowModal(true)}>Add Asset</button>
      <SDBModal isOpen={showSDBModal} onClose={() => setSDBShowModal(false)}>
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
        <button onClick={() => setSDBShowModal(false)}>Close</button>
      </SDBModal>
    </div>
  );
};

export default AssetSelector;
