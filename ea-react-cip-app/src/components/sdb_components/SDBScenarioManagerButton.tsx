import React, { useState } from "react";
import styled from "styled-components";
import { FaRegClipboard } from "react-icons/fa";
import SDBModal from "./sdb_cards/SDBModal";
import ScenarioManagerContent from "./SDBScenarioManagerContent";

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

const ScenarioManagerButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <StyledButton onClick={() => setShowModal(true)}>
        <FaRegClipboard />
        Scenario Manager
      </StyledButton>
      {showModal && (
        <SDBModal isOpen={true} onClose={() => setShowModal(false)}>
          <h3>Scenario Manager</h3>
          <ScenarioManagerContent />
          <StyledButton onClick={() => setShowModal(false)}>Close</StyledButton>
        </SDBModal>
      )}
    </>
  );
};

export default ScenarioManagerButton;
