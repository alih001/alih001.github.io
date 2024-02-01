import React from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.div`
  width: 300px;
  height: 40px;
  display: flex;
  cursor: pointer;
  position: relative;
  overflow: hidden; // Hide the overflow of pseudo-elements
  margin-left: 10rem;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 20rem; // Width of the diagonal edge
    background: inherit; // Inherit the background color from the parent
    transform: skewX(70deg); // Adjust the skew angle for desired diagonal edge
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
  background-color: ${(props) => (props.checked ? '#3D314A' : '#D3D3D3')};
  color: ${(props) => (props.checked ? '#fff' : '#000')};
`;

const CostSection = styled(Section)<SectionProps>`
  background-color: ${(props) => (props.checked ? '#D3D3D3' : '#3D314A')};
  color: ${(props) => (props.checked ? '#000' : '#fff')};
`;

interface CustomizedSwitchesProps {
  checked: boolean;
  onChange: () => void;
}

export default function CustomizedSwitches({ checked, onChange }: CustomizedSwitchesProps) {
  return (
    <SwitchContainer onClick={onChange}>
      <AssetSection checked={checked}>Asset Table</AssetSection>
      <CostSection checked={checked}>Cost Table</CostSection>
    </SwitchContainer>
  );
}
