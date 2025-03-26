import React from "react";
import { FilterControlsProps } from "../../types/public-types";
import styled from "styled-components";

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
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
      <FilterGroup>
        <FilterLabel htmlFor="planning-scenario">
          Planning Scenario:
        </FilterLabel>
        <Select
          id="planning-scenario"
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
        </Select>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel htmlFor="growth-forecast">Growth Forecast:</FilterLabel>
        <Select
          id="growth-forecast"
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
        </Select>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel htmlFor="drought-scenario">Drought Scenario:</FilterLabel>
        <Select
          id="drought-scenario"
          value={criteria.drought}
          onChange={(e) =>
            setCriteria({ ...criteria, drought: e.target.value })
          }
        >
          <option value="None">None</option>
          <option value="1/500">1/500</option>
          <option value="1/200">1/200</option>
          <option value="1/100">1/100</option>
        </Select>
      </FilterGroup>
    </FilterContainer>
  );
};

export default FilterControls;
