import React, { useState } from "react";
import styled from "styled-components";
import { useScenarioManager } from "../../hooks/useScenarioManager";
import { FaPlusCircle } from "react-icons/fa";

const ContentWrapper = styled.div`
  margin-top: 1rem;
`;

const FieldGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

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

const ScenarioList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li {
    margin-bottom: 0.5rem;
  }

  button {
    margin-left: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.85rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const ScenarioManagerContent: React.FC = () => {
  const { scenarios, loadScenario, deleteScenario, saveScenario } =
    useScenarioManager();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showCreationForm, setShowCreationForm] = useState(false);

  const handleSave = () => {
    if (name.trim() === "") return; // require a scenario name
    saveScenario(name, description);
    setName("");
    setDescription("");
    setShowCreationForm(false);
  };

  return (
    <ContentWrapper>
      <StyledButton onClick={() => setShowCreationForm((prev) => !prev)}>
        <FaPlusCircle />
        {showCreationForm ? "Cancel New Scenario" : "New Scenario"}
      </StyledButton>

      {showCreationForm && (
        <>
          <FieldGroup>
            <Label>Scenario Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter scenario name"
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Description</Label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
            />
          </FieldGroup>
          <StyledButton onClick={handleSave}>Save Scenario</StyledButton>
        </>
      )}

      {scenarios.length > 0 && (
        <ScenarioList>
          {scenarios.map((scenario) => (
            <li key={scenario.id}>
              <strong>{scenario.name}</strong> -{" "}
              {new Date(scenario.createdAt).toLocaleString()}
              <button onClick={() => loadScenario(scenario.filterCriteria)}>
                Load
              </button>
              <button onClick={() => deleteScenario(scenario.id)}>
                Delete
              </button>
            </li>
          ))}
        </ScenarioList>
      )}
    </ContentWrapper>
  );
};

export default ScenarioManagerContent;
