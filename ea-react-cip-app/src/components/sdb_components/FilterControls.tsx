// FilterControls.tsx
import React from "react";
import { FilterControlsProps } from "../../types/public-types"; // wherever FilterCriteria is defined
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* adds spacing between the dropdowns */
`;

const FilterControls: React.FC<FilterControlsProps> = ({
  criteria,
  setCriteria,
  zones,
  planningScenarios,
  growthForecasts,
}) => {
  return (
    <FilterContainer>
      <label>
        WRZ:
        <select
          value={criteria.wrz}
          onChange={(e) => setCriteria({ ...criteria, wrz: e.target.value })}
        >
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
          {growthForecasts.map((gf) => (
            <option key={gf} value={gf}>
              {gf}
            </option>
          ))}
        </select>
      </label>
      <label>
        Drought Scenario:
        <select
          value={criteria.drought}
          onChange={(e) =>
            setCriteria({ ...criteria, drought: e.target.value })
          }
        >
          <option value="None">None</option>
          <option value="1/500">1/500</option>
          <option value="1/200">1/200</option>
          <option value="1/100">1/100</option>
        </select>
      </label>
    </FilterContainer>
  );
};

export default FilterControls;
