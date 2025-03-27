import React from "react";
import styled from "styled-components";

const SwitchContainer = styled.div`
  width: 300px;
  height: 40px;
  display: flex;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.75);
  border-radius: 10px;
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20rem;
    background: inherit;
    transform: skewX(70deg);
  }

  &::before {
    left: 0;
    transform-origin: top left;
  }

  &::after {
    right: 0;
    transform-origin: top right;
  }
`;

const Section = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

interface SectionProps {
  checked: boolean;
}

const AssetSection = styled(Section)<SectionProps>`
  background-color: ${(props) => (props.checked ? "#1a87e2" : "#D3D3D3")};
  color: ${(props) => (props.checked ? "#fff" : "#000")};
`;

const CostSection = styled(Section)<SectionProps>`
  background-color: ${(props) => (props.checked ? "#D3D3D3" : "#1a87e2")};
  color: ${(props) => (props.checked ? "#000" : "#fff")};
`;

interface CustomizedSwitchesProps {
  checked: boolean;
  onChange: () => void;
}

export default function CustomizedSwitches({
  checked,
  onChange,
}: CustomizedSwitchesProps) {
  return (
    <SwitchContainer onClick={onChange}>
      <AssetSection checked={checked}>Asset Table</AssetSection>
      <CostSection checked={checked}>Cost Table</CostSection>
    </SwitchContainer>
  );
}
