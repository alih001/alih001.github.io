// src/hooks/useChartData.ts
import { useMemo, useEffect } from "react";
import { useData } from "../contexts/useDataContext";
import { FilterCriteria } from "../types/public-types";

export const useChartData = () => {
  const { demandData, supplyData, filterCriteria, setFilterCriteria } =
    useData();

  // Automatically set default filter criteria if not already set.
  useEffect(() => {
    if (demandData.length > 0 && !filterCriteria.wrz) {
      const newZones = Array.from(new Set(demandData.map((d) => d.zone)));
      const newPlanningScenarios = Array.from(
        new Set(demandData.map((d) => d.planningScenario))
      );
      const newGrowthForecasts = Array.from(
        new Set(demandData.map((d) => d.growthForecast))
      );
      // Set defaults based on the first available values.
      setFilterCriteria({
        wrz: newZones[0] || "",
        planningScenario: newPlanningScenarios[0] || "",
        growthForecast: newGrowthForecasts[0] || "",
        drought: "None",
      });
    }
  }, [demandData, filterCriteria.wrz, setFilterCriteria]);

  // Compute filtered demand data.
  const filteredDemandData = useMemo(() => {
    return demandData.filter(
      (d) =>
        d.zone === filterCriteria.wrz &&
        d.planningScenario === filterCriteria.planningScenario &&
        d.growthForecast === filterCriteria.growthForecast
    );
  }, [demandData, filterCriteria]);

  // Compute filtered supply data.
  const filteredSupplyData = useMemo(() => {
    return supplyData.filter(
      (s: any) =>
        s.wrz === filterCriteria.wrz &&
        s.scenario === filterCriteria.planningScenario
    );
  }, [supplyData, filterCriteria]);

  // Pick the first matching record for the charts.
  const demandForChart = useMemo(
    () => filteredDemandData[0] || null,
    [filteredDemandData]
  );
  const supplyForChart = useMemo(
    () => filteredSupplyData[0] || null,
    [filteredSupplyData]
  );

  return {
    demandForChart,
    supplyForChart,
    filteredDemandData,
    filteredSupplyData,
  };
};
