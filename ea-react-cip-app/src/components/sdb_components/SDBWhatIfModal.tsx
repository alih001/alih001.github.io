import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useData } from "../../contexts/useDataContext";
import WhatIfSelector from "./SDBWhatIfSelector";
import { WhatIfScenario } from "../../types/public-types";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  margin-right: 0.5rem;
  width: auto;
  height: auto;
  vertical-align: middle;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  animation: ${fadeIn} 0.3s ease-in-out;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #aaa;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }
`;

const Header = styled.h3`
  margin-top: 0;
  font-size: 1.75rem;
  display: flex;
  align-items: center;
`;

const Section = styled.section`
  margin-top: 1.5rem;
`;

const SectionHeader = styled.h4`
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Row = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2e6ef7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #204ecf;
  }
`;

// Add/update these styled components:
const FullWidthField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  height: 2.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const WhatIfModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    simulation,
    setSimulation,
    whatIfScenarios,
    setWhatIfScenarios,
    setActiveWhatIfId,
  } = useData();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [demandReductionPercent, setDemandReductionPercent] =
    useState<number>(0);
  const [demandReductionStartYear, setDemandReductionStartYear] =
    useState<number>(2030);
  const [droughtOverride, setDroughtOverride] = useState<
    "None" | "1/100" | "1/200" | "1/500"
  >("None");
  const [assetDeterioration, setAssetDeterioration] = useState<number>(0);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSaveScenario = () => {
    const id = crypto.randomUUID();
    const newScenario: WhatIfScenario = {
      id,
      name,
      description,
      createdAt: Date.now(),
      config: {
        growthRate: simulation.growthRate,
        startYear: simulation.startYear,
        demandReduction: {
          percent: demandReductionPercent,
          startYear: demandReductionStartYear,
        },
        droughtOverride,
        assetDeterioration,
      },
    };

    setWhatIfScenarios((prev) => [...prev, newScenario]);
    setActiveWhatIfId(id);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSimulation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close Modal">
          &times;
        </CloseButton>
        <Header>🔮 What-If Simulation</Header>
        {/* Basic Options Section */}
        <Section>
          <SectionHeader>Basic Options</SectionHeader>
          <GridContainer>
            <FieldGroup>
              <Label>Start Year</Label>
              <Input
                type="number"
                name="startYear"
                value={simulation.startYear}
                onChange={handleChange}
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Annual Growth Rate (%)</Label>
              <Input
                type="number"
                name="growthRate"
                value={simulation.growthRate}
                onChange={handleChange}
              />
            </FieldGroup>
          </GridContainer>
        </Section>
        {/* Advanced Options Section */}
        <Section>
          <SectionHeader>Advanced Options</SectionHeader>
          <GridContainer>
            <FieldGroup>
              <Label>Demand Reduction (%)</Label>
              <Input
                type="number"
                value={demandReductionPercent}
                onChange={(e) =>
                  setDemandReductionPercent(Number(e.target.value))
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Demand Reduction Start Year</Label>
              <Input
                type="number"
                value={demandReductionStartYear}
                onChange={(e) =>
                  setDemandReductionStartYear(Number(e.target.value))
                }
              />
            </FieldGroup>
          </GridContainer>
          <GridContainer style={{ marginTop: "1rem" }}>
            <FieldGroup>
              <Label>Drought Override</Label>
              <Select
                value={droughtOverride}
                onChange={(e) => setDroughtOverride(e.target.value as any)}
              >
                <option value="None">None</option>
                <option value="1/100">1/100</option>
                <option value="1/200">1/200</option>
                <option value="1/500">1/500</option>
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label>Asset Deterioration (% per year)</Label>
              <Input
                type="number"
                value={assetDeterioration}
                onChange={(e) => setAssetDeterioration(Number(e.target.value))}
              />
            </FieldGroup>
          </GridContainer>
          <FieldGroup style={{ marginTop: "1rem" }}>
            <Label>
              <Checkbox
                name="active"
                checked={simulation.active}
                onChange={handleChange}
              />
              Enable Simulation Mode
            </Label>
          </FieldGroup>
        </Section>
        {/* Scenario Details Section */}
        <Section>
          <SectionHeader>Scenario Details</SectionHeader>
          <FullWidthField>
            <Label>Scenario Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FullWidthField>
          <FullWidthField>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FullWidthField>
        </Section>
        {/* What-If Selector */}
        <Section>
          <WhatIfSelector />
        </Section>
        {/* Action Buttons */}
        <Row>
          <Button onClick={handleSaveScenario}>Save Scenario</Button>
          <Button onClick={onClose}>Close</Button>
        </Row>
      </ModalContainer>
    </Overlay>
  );
};

export default WhatIfModal;
