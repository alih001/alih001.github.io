import React, { useState } from "react";
import styled from "styled-components";
import { useData } from "../../contexts/useDataContext";
import { WhatIfScenario } from "../../types/public-types";
import WhatIfSelector from "./SDBWhatIfSelector";

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

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  height: 2.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FullWidthField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  margin-right: 0.5rem;
  width: auto;
  height: auto;
  vertical-align: middle;
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

const WhatIfParametersTab: React.FC = () => {
  const {
    simulation,
    setSimulation,
    whatIfScenarios,
    setWhatIfScenarios,
    setActiveWhatIfId,
  } = useData();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [demandReductionPercent, setDemandReductionPercent] = useState<number>(0);
  const [demandReductionStartYear, setDemandReductionStartYear] = useState<number>(2030);
  const [droughtOverride, setDroughtOverride] = useState<"None" | "1/100" | "1/200" | "1/500">("None");
  const [assetDeterioration, setAssetDeterioration] = useState<number>(0);

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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSimulation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  return (
    <>
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

      <Section>
        <SectionHeader>Advanced Options</SectionHeader>
        <GridContainer>
          <FieldGroup>
            <Label>Demand Reduction (%)</Label>
            <Input
              type="number"
              value={demandReductionPercent}
              onChange={(e) => setDemandReductionPercent(Number(e.target.value))}
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Demand Reduction Start Year</Label>
            <Input
              type="number"
              value={demandReductionStartYear}
              onChange={(e) => setDemandReductionStartYear(Number(e.target.value))}
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

      <Section>
        <WhatIfSelector />
      </Section>

      <Row>
        <Button onClick={handleSaveScenario}>Save Scenario</Button>
      </Row>
    </>
  );
};

export default WhatIfParametersTab;
