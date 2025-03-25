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
    simulation,
  } = useData();

  // Sync WRZ tab with filterCriteria.wrz
  useEffect(() => {
    if (activeWRZ && filterCriteria.wrz !== activeWRZ) {
      setFilterCriteria((prev) => ({
        ...prev,
        wrz: activeWRZ,
      }));
    }
  }, [activeWRZ, filterCriteria.wrz, setFilterCriteria]);

  // Set default scenario filters when demand data is loaded
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

  // Demand filtering
  const filteredDemandData = useMemo(() => {
    return demandData.filter(
      (d) =>
        d.zone?.trim() === filterCriteria.wrz?.trim() &&
        d.planningScenario?.trim() ===
          filterCriteria.planningScenario?.trim() &&
        d.growthForecast?.trim() === filterCriteria.growthForecast?.trim()
    );
  }, [demandData, filterCriteria]);

  const demandForChart = useMemo(() => {
    return filteredDemandData[0] || null;
  }, [filteredDemandData]);

  const simulatedDemandForChart = useMemo(() => {
    if (!simulation.active || !demandForChart) return null;

    const adjusted = {
      ...demandForChart,
      yearlyDemand: { ...demandForChart.yearlyDemand },
    };

    const factor = 1 + simulation.growthRate / 100;

    for (const yearStr of Object.keys(adjusted.yearlyDemand)) {
      const year = Number(yearStr);
      if (year >= simulation.startYear) {
        const base = Number(demandForChart.yearlyDemand[yearStr]) || 0;
        const yearsSince = year - simulation.startYear;
        const newValue = base * Math.pow(factor, yearsSince);
        adjusted.yearlyDemand[yearStr] = newValue;
      }
    }

    return adjusted;
  }, [simulation, demandForChart]);

  // Supply filtering
  const filteredSupplyData = useMemo(() => {
    return supplyData.filter(
      (s) =>
        s.wrz?.trim() === filterCriteria.wrz?.trim() &&
        s.scenario?.trim() === filterCriteria.planningScenario?.trim()
    );
  }, [supplyData, filterCriteria]);

  const supplyForChart = useMemo(() => {
    return filteredSupplyData[0] || null;
  }, [filteredSupplyData]);

  return {
    filteredDemandData,
    demandForChart,
    simulatedDemandForChart,
    supplyForChart,
    filteredSupplyData,
  };
};
