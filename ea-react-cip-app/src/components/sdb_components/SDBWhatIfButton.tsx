import React, { useState } from "react";
import styled from "styled-components";
import { FaMagic } from "react-icons/fa";
import WhatIfModal from "./SDBWhatIfModal";

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

const WhatIfButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <StyledButton onClick={() => setShowModal(true)}>
        <FaMagic />
        What-If Simulator
      </StyledButton>
      {showModal && <WhatIfModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default WhatIfButton;
