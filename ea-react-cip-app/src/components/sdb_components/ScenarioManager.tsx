import React from "react";
import { useScenarioManager } from "../../hooks/useScenarioManager";

const ScenarioManagerComponent: React.FC = () => {
  const { scenarios, saveScenario, loadScenario, deleteScenario } =
    useScenarioManager();

  // Your component can now call saveScenario, loadScenario, and deleteScenario as needed.
  // For example:
  const handleSave = () => {
    saveScenario("My Scenario", "Description here");
  };

  const handleLoad = (scenario) => {
    loadScenario(scenario.filterCriteria);
  };

  return (
    <div>
      <h3>Saved Scenarios</h3>
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
    </div>
  );
};

export default ScenarioManagerComponent;
