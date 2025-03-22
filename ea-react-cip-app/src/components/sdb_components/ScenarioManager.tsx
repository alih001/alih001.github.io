// ScenarioManager.tsx
import React, { useContext, useState } from "react";
import DataContext from "../../contexts/DataContext";
import { Scenario, FilterCriteria } from "../../types/public-types"; // Ensure these types are defined
import { v4 as uuidv4 } from "uuid";
import { useData } from "../../contexts/useDataContext";
import { ScenarioManagerProps } from "../../types/public-types";

const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  activeFilterCriteria,
  onLoadScenario,
}) => {
  const inputData = useData();
  const { scenarios, setScenarios } = useData();
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioDescription, setScenarioDescription] = useState("");

  if (!inputData) return <div>Error: Input data not available.</div>;

  const handleSaveScenario = () => {
    console.log("Saving scenario with filter criteria:", activeFilterCriteria);
    const currentFilterCriteria: FilterCriteria = activeFilterCriteria;
    const newScenario: Scenario = {
      id: uuidv4(),
      name: scenarioName,
      description: scenarioDescription,
      filterCriteria: currentFilterCriteria,
      createdAt: Date.now(),
    };
    console.log("New scenario object:", newScenario);
    setScenarios((prev) => [...prev, newScenario]);
    setScenarioName("");
    setScenarioDescription("");
  };

  const handleLoadScenario = (scenario: Scenario) => {
    onLoadScenario(scenario.filterCriteria);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== scenarioId));
  };

  return (
    <div>
      <h3>Save a New Scenario</h3>
      <input
        type="text"
        value={scenarioName}
        onChange={(e) => setScenarioName(e.target.value)}
        placeholder="Scenario Name"
      />
      <textarea
        value={scenarioDescription}
        onChange={(e) => setScenarioDescription(e.target.value)}
        placeholder="Description (optional)"
      />
      <button onClick={handleSaveScenario}>Save Scenario</button>

      <h3>Saved Scenarios</h3>
      <ul>
        {scenarios.map((scenario) => (
          <li key={scenario.id}>
            <strong>{scenario.name}</strong> -{" "}
            {new Date(scenario.createdAt).toLocaleString()}
            <button onClick={() => handleLoadScenario(scenario)}>Load</button>
            <button onClick={() => handleDeleteScenario(scenario.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScenarioManager;
