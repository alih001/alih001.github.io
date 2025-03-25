import React, { useState } from "react";
import styled from "styled-components";
import { useData } from "../../contexts/useDataContext";
import WhatIfSelector from "./SDBWhatIfSelector";

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
`;

const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-top: 1rem;
`;

const Input = styled.input`
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Row = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2e6ef7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #204ecf;
  }
`;

interface WhatIfModalProps {
  onClose: () => void;
}

const WhatIfModal: React.FC<WhatIfModalProps> = ({ onClose }) => {
  const { simulation, setSimulation } = useData();
  const { whatIfScenarios, setWhatIfScenarios, setActiveWhatIfId } = useData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveScenario = () => {
    const id = crypto.randomUUID();
    const newScenario = {
      id,
      name,
      description,
      createdAt: Date.now(),
      config: {
        startYear: simulation.startYear,
        growthRate: simulation.growthRate,
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
      <Modal onClick={(e) => e.stopPropagation()}>
        <h3>🔮 What-If Simulation</h3>

        <Label>Start Year</Label>
        <Input
          type="number"
          name="startYear"
          value={simulation.startYear}
          onChange={handleChange}
        />

        <Label>Annual Growth Rate (%)</Label>
        <Input
          type="number"
          name="growthRate"
          value={simulation.growthRate}
          onChange={handleChange}
        />

        <Label>
          <input
            type="checkbox"
            name="active"
            checked={simulation.active}
            onChange={handleChange}
          />{" "}
          Enable Simulation Mode
        </Label>
        <Label>Scenario Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />

        <Label>Description</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <WhatIfSelector />

        <Row>
          <Button onClick={handleSaveScenario}>Save Scenario</Button>
          <Button onClick={onClose}>Close</Button>
        </Row>
      </Modal>
    </Overlay>
  );
};

export default WhatIfModal;
