import React, { useState } from "react";
import styled from "styled-components";
import { useScenarioManager } from "../../hooks/useScenarioManager";
import ExportButton from "./SDBExportToExcel";
// Styled modal components
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
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ScenarioManagerComponent: React.FC = () => {
  const { scenarios, saveScenario, loadScenario, deleteScenario } =
    useScenarioManager();
  const [showModal, setShowModal] = useState(false);
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioDescription, setScenarioDescription] = useState("");

  // When the user clicks the save button, open the modal.
  const handleSave = () => {
    setShowModal(true);
  };

  // Handle modal form submission.
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

  // Function to load a scenario.
  const handleLoad = (scenario: any) => {
    loadScenario(scenario.filterCriteria);
  };

  return (
    <div>
      <ul>
        {scenarios.map((scenario) => (
          <li key={scenario.id}>
            <strong>{scenario.name}</strong> -{" "}
            {new Date(scenario.createdAt).toLocaleString()}
            <button onClick={() => handleLoad(scenario)}>Load</button>
            <button onClick={() => deleteScenario(scenario.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>Save Current Scenario</button>

      <div style={{ marginTop: "1rem" }}>
        <ExportButton />
      </div>

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3>Save Current Scenario</h3>
            <div>
              <label>
                Scenario Name:
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                Description:
                <textarea
                  value={scenarioDescription}
                  onChange={(e) => setScenarioDescription(e.target.value)}
                />
              </label>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button onClick={handleModalSave}>Save Scenario</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default ScenarioManagerComponent;
