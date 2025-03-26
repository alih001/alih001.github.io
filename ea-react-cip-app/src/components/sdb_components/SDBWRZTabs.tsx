import React from "react";
import styled from "styled-components";
import { useData } from "../../contexts/useDataContext";

const TabsContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  background-color: ${(props) => (props.active ? "#2e6ef7" : "#f0f0f0")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  border: none;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.active ? "#265bb2" : "#dcdcdc")};
    transform: translateY(-2px);
  }
`;

const WRZTabs: React.FC = () => {
  const { wrzList, activeWRZ, setActiveWRZ } = useData();

  if (wrzList.length <= 1) return null;

  return (
    <TabsContainer>
      {wrzList.map((wrz) => (
        <TabButton
          key={wrz}
          active={wrz === activeWRZ}
          onClick={() => setActiveWRZ(wrz)}
        >
          {wrz}
        </TabButton>
      ))}
    </TabsContainer>
  );
};

export default WRZTabs;
