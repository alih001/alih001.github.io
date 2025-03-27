import React, { useState } from "react";
import styled from "styled-components";
import { useScenarioManager } from "../../hooks/useScenarioManager";
import ExportButton from "./SDBExportToExcel";

const Container = styled.div`
  padding: 1rem;
`;

const ScenarioList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ScenarioItem = styled.li`
  background: #f9f9f9;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScenarioInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ScenarioActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: string }>`
  background: ${(props) =>
    props.variant === "danger"
      ? "#dc3545"
      : props.variant === "success"
      ? "#28a745"
      : "#007bff"};
  border: none;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) =>
      props.variant === "danger"
        ? "#c82333"
        : props.variant === "success"
        ? "#218838"
        : "#0056b3"};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const TextInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ScenarioManagerComponent: React.FC = () => {
  const { scenarios, saveScenario, loadScenario, deleteScenario } =
    useScenarioManager();
  const [showModal, setShowModal] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioDescription, setScenarioDescription] = useState("");

  const handleSave = () => {
    setShowModal(true);
  };

  const handleModalSave = () => {
    if (!scenarioName) {
      alert("Please enter a scenario name.");
      return;
    }
    saveScenario(scenarioName, scenarioDescription);
    setShowModal(false);
    setScenarioName("");
    setScenarioDescription("");
  };

  const handleLoad = (scenario: any) => {
    loadScenario(scenario.filterCriteria);
  };

  return (
    <Container>
      <ScenarioList>
        {scenarios.map((scenario) => (
          <ScenarioItem key={scenario.id}>
            <ScenarioInfo>
              <strong>{scenario.name}</strong>
              <small>{new Date(scenario.createdAt).toLocaleString()}</small>
            </ScenarioInfo>
            <ScenarioActions>
              <Button onClick={() => handleLoad(scenario)}>Load</Button>
              <Button
                variant="danger"
                onClick={() => deleteScenario(scenario.id)}
              >
                Delete
              </Button>
            </ScenarioActions>
          </ScenarioItem>
        ))}
      </ScenarioList>
      <Button onClick={handleSave}>Save Current Scenario</Button>
      <div style={{ marginTop: "1rem" }}>
        <ExportButton />
      </div>
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Save Current Scenario</h3>
            <FormGroup>
              <Label>Scenario Name:</Label>
              <TextInput
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Description:</Label>
              <TextArea
                value={scenarioDescription}
                onChange={(e) => setScenarioDescription(e.target.value)}
                rows={3}
              />
            </FormGroup>
            <ModalActions>
              <Button variant="success" onClick={handleModalSave}>
                Save Scenario
              </Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ScenarioManagerComponent;
