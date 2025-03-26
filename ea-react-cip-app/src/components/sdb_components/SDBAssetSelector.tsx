import React, { useState } from "react";
import styled from "styled-components";
import { useAssetSelector } from "../../hooks/useAssetSelector";
import { AssetSelectorProps } from "../../types/public-types";
import SDBModal from "./sdb_cards/SDBModal";

const AssetSelectorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AddAssetButton = styled.button`
  background: #007bff;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const AssetList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AssetItem = styled.li`
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #333;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const CloseButton = styled.button`
  background: #6c757d;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background 0.2s ease;

  &:hover {
    background: #5a6268;
  }
`;

const AssetSelector: React.FC<AssetSelectorProps> = ({ allAssets }) => {
  const { selectedAssets, handleToggleAsset } = useAssetSelector();
  const [showSDBModal, setSDBShowModal] = useState(false);

  return (
    <AssetSelectorWrapper>
      <AddAssetButton onClick={() => setSDBShowModal(true)}>
        Add Asset
      </AddAssetButton>
      <SDBModal isOpen={showSDBModal} onClose={() => setSDBShowModal(false)}>
        <h3>Select Assets to Implement</h3>
        <AssetList>
          {allAssets.map((assetName) => (
            <AssetItem key={assetName}>
              <Label>
                <Checkbox
                  type="checkbox"
                  checked={selectedAssets.has(assetName)}
                  onChange={() => handleToggleAsset(assetName)}
                />
                {assetName}
              </Label>
            </AssetItem>
          ))}
        </AssetList>
        <CloseButton onClick={() => setSDBShowModal(false)}>Close</CloseButton>
      </SDBModal>
    </AssetSelectorWrapper>
  );
};

export default AssetSelector;
