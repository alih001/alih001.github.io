import { useMemo } from "react";
import { useData } from "../contexts/useDataContext";

export const useFilterOptions = () => {
  const { demandData } = useData();

  const zones = useMemo(() => {
    return Array.from(new Set(demandData.map((d) => d.zone)));
  }, [demandData]);

  const planningScenarios = useMemo(() => {
    return Array.from(new Set(demandData.map((d) => d.planningScenario)));
  }, [demandData]);

  const growthForecasts = useMemo(() => {
    return Array.from(new Set(demandData.map((d) => d.growthForecast)));
  }, [demandData]);

  return { zones, planningScenarios, growthForecasts };
};
