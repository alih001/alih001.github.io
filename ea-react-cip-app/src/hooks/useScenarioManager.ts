// src/hooks/useScenarioManager.ts
import { useData } from "../contexts/useDataContext";
import { FilterCriteria, Scenario } from "../types/public-types";
import { v4 as uuidv4 } from "uuid";

export const useScenarioManager = () => {
  const { scenarios, setScenarios, filterCriteria, setFilterCriteria } =
    useData();

  const saveScenario = (name: string, description?: string) => {
    const newScenario: Scenario = {
      id: uuidv4(),
      name,
      description,
      filterCriteria, // capture the current active filter criteria
      createdAt: Date.now(),
    };

    setScenarios((prev) => [...prev, newScenario]);
  };

  const loadScenario = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria);
  };

  const deleteScenario = (id: string) => {
    setScenarios((prev) => prev.filter((scenario) => scenario.id !== id));
  };

  return {
    scenarios,
    filterCriteria,
    saveScenario,
    loadScenario,
    deleteScenario,
  };
};
