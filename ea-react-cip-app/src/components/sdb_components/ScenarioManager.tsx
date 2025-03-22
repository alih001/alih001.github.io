// ScenarioManager.tsx
import React, { useContext, useState } from "react";
import DataContext from "../../contexts/DataContext";
import { Scenario, FilterCriteria } from "../../types/public-types"; // Ensure these types are defined
import { v4 as uuidv4 } from "uuid";

interface ScenarioManagerProps {
  activeFilterCriteria: FilterCriteria;
  onLoadScenario: (criteria: FilterCriteria) => void;
}

const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  activeFilterCriteria,
  onLoadScenario,
}) => {
  const dataContext = useContext(DataContext);
  if (!dataContext) return <div>Error: DataContext not available.</div>;

  const { scenarios, setScenarios } = dataContext;
  const [scenarioName, setScenarioName] = useState("");
  const [scenarioDescription, setScenarioDescription] = useState("");

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
