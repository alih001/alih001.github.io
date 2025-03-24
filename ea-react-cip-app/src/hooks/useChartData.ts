// src/hooks/useChartData.ts
import { useMemo, useEffect } from "react";
import { useData } from "../contexts/useDataContext";

export const useChartData = () => {
  const {
    demandData,
    supplyData,
    activeWRZ,
    filterCriteria,
    setFilterCriteria,
  } = useData();

  //
  // Sync activeWRZ with filterCriteria.wrz
  //
  useEffect(() => {
    if (activeWRZ && filterCriteria.wrz !== activeWRZ) {
      setFilterCriteria((prev) => ({
        ...prev,
        wrz: activeWRZ,
      }));
    }
  }, [activeWRZ, filterCriteria.wrz, setFilterCriteria]);

  //
  // Set default filter criteria
  //
  useEffect(() => {
    if (demandData.length > 0 && !filterCriteria.planningScenario) {
      const newPlanningScenarios = Array.from(
        new Set(demandData.map((d) => d.planningScenario))
      );
      const newGrowthForecasts = Array.from(
        new Set(demandData.map((d) => d.growthForecast))
      );

      setFilterCriteria((prev) => ({
        wrz: activeWRZ || prev.wrz || "",
        planningScenario: newPlanningScenarios[0] || "",
        growthForecast: newGrowthForecasts[0] || "",
        drought: "None",
      }));
    }
  }, [
    demandData,
    activeWRZ,
    filterCriteria.planningScenario,
    setFilterCriteria,
  ]);

  //
  // Filtered demand and supply data based on WRZ + scenario + growth
  //
  const filteredDemandData = useMemo(() => {
    return demandData.filter(
      (d) =>
        d.zone === filterCriteria.wrz &&
        d.planningScenario === filterCriteria.planningScenario &&
        d.growthForecast === filterCriteria.growthForecast
    );
  }, [demandData, filterCriteria]);

  const filteredSupplyData = useMemo(() => {
    return supplyData.filter(
      (s) =>
        s.wrz === filterCriteria.wrz &&
        s.scenario === filterCriteria.planningScenario
    );
  }, [supplyData, filterCriteria]);

  //
  // Pick the first matching row for chart display
  //
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
