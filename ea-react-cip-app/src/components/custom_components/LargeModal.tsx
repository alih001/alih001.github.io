import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const ModalContainer = styled.div`
  width: 45vw;
  height: 85vh;
  background: #fff;
  border-radius: 8px;
  padding: 32px;
  box-sizing: border-box;
  overflow: auto;
`;

interface LargeModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const LargeModal: React.FC<LargeModalProps> = ({ onClose, children }) => {
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContainer>
    </Overlay>
  );
};

export default LargeModal;
