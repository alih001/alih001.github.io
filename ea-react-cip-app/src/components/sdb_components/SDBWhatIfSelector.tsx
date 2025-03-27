import React from "react";
import { useData } from "../../contexts/useDataContext";

const WhatIfSelector: React.FC = () => {
  const { whatIfScenarios, activeWhatIfId, setActiveWhatIfId } = useData();

  if (whatIfScenarios.length === 0) return null;

  return (
    <div style={{ marginTop: "1rem" }}>
      <label htmlFor="what-if-select">
        <strong>Select What-If Scenario:</strong>
      </label>
      <select
        id="what-if-select"
        value={activeWhatIfId || ""}
        onChange={(e) => setActiveWhatIfId(e.target.value)}
        style={{ marginTop: "0.5rem", width: "100%", padding: "0.5rem" }}
      >
        <option value="">None (Disable Simulation)</option>
        {whatIfScenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WhatIfSelector;
