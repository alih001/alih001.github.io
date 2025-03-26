import React, { useState } from "react";
import styled from "styled-components";
import { FaPlusCircle } from "react-icons/fa";
import SDBModal from "./sdb_cards/SDBModal";
import { useAssetSelector } from "../../hooks/useAssetSelector";

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  gap: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ContentWrapper = styled.div`
  margin-top: 1rem;
`;

const AssetSelectorContent: React.FC<{ allAssets: string[] }> = ({
  allAssets,
}) => {
  const { selectedAssets, handleToggleAsset } = useAssetSelector();
  return (
    <ContentWrapper>
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
    </ContentWrapper>
  );
};

const AssetSelectorButton: React.FC<{ allAssets: string[] }> = ({
  allAssets,
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <StyledButton onClick={() => setShowModal(true)}>
        <FaPlusCircle />
        Asset Selector
      </StyledButton>
      {showModal && (
        <SDBModal isOpen={true} onClose={() => setShowModal(false)}>
          <h3>Select Assets to Implement</h3>
          <AssetSelectorContent allAssets={allAssets} />
          <StyledButton onClick={() => setShowModal(false)}>Close</StyledButton>
        </SDBModal>
      )}
    </>
  );
};

export default AssetSelectorButton;
