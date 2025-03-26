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

const ModalHeader = styled.h3`
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1.4rem;
  color: #333;
`;

const ContentWrapper = styled.div`
  margin-top: 1rem;
`;

const AssetList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AssetListItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const AssetLabel = styled.label`
  flex: 1;
  font-size: 1rem;
  color: #333;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: auto;
  height: auto;
  margin-right: 8px;
`;

const AssetSelectorContent: React.FC<{ allAssets: string[] }> = ({
  allAssets,
}) => {
  const { selectedAssets, handleToggleAsset } = useAssetSelector();
  return (
    <ContentWrapper>
      <AssetList>
        {allAssets.map((assetName) => (
          <AssetListItem key={assetName}>
            <Checkbox
              checked={selectedAssets.has(assetName)}
              onChange={() => handleToggleAsset(assetName)}
            />
            <AssetLabel>{assetName}</AssetLabel>
          </AssetListItem>
        ))}
      </AssetList>
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
          <ModalHeader>Select Assets to Implement</ModalHeader>
          <AssetSelectorContent allAssets={allAssets} />
          <StyledButton onClick={() => setShowModal(false)}>Close</StyledButton>
        </SDBModal>
      )}
    </>
  );
};

export default AssetSelectorButton;
