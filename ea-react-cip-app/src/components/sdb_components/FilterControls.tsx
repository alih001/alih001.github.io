// FilterControls.tsx
import React from "react";

export interface FilterCriteria {
  wrz: string;
  planningScenario: string;
  growthForecast: string;
}

interface FilterControlsProps {
  criteria: FilterCriteria;
  setCriteria: (criteria: FilterCriteria) => void;
  zones: string[];
  planningScenarios: string[];
  growthForecasts: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({
  criteria,
  setCriteria,
  zones,
  planningScenarios,
  growthForecasts,
}) => {
  return (
    <div>
      <label>
        WRZ:
        <select
          value={criteria.wrz}
          onChange={(e) => setCriteria({ ...criteria, wrz: e.target.value })}
        >
          <option value="">All</option>
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </label>
      <label>
        Planning Scenario:
        <select
          value={criteria.planningScenario}
          onChange={(e) =>
            setCriteria({ ...criteria, planningScenario: e.target.value })
          }
        >
          <option value="">All</option>
          {planningScenarios.map((ps) => (
            <option key={ps} value={ps}>
              {ps}
            </option>
          ))}
        </select>
      </label>
      <label>
        Growth Forecast:
        <select
          value={criteria.growthForecast}
          onChange={(e) =>
            setCriteria({ ...criteria, growthForecast: e.target.value })
          }
        >
          <option value="">All</option>
          {growthForecasts.map((gf) => (
            <option key={gf} value={gf}>
              {gf}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FilterControls;
