import React, { useState } from "react";
import styled from "styled-components";
import WRZBreakdownModal from "./WRZBreakdownModal";

const StyledButton = styled.button`
  display: block;
  width: 100%;
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const WRZBreakdownButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <StyledButton onClick={() => setShowModal(true)}>
        View WRZ Breakdown
      </StyledButton>
      {showModal && <WRZBreakdownModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default WRZBreakdownButton;
