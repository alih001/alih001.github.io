import { useCallback } from "react";
import { percentile } from "../utils/statistics";

export interface MonteCarloRunResult {
  year: number;
  supply: number;
  demand: number;
  shortfall: number;
}

export type MonteCarloRun = MonteCarloRunResult[];

export interface MonteCarloSummaryByYear {
  year: number;
  medianSupply: number;
  medianDemand: number;
  percentile5: number;
  percentile95: number;
  probabilityOfShortfall: number;
}

export interface MonteCarloResults {
  runs: MonteCarloRun[];
  summary: MonteCarloSummaryByYear[];
}

interface RunSimulationParams {
  numRuns: number;
  years: number[];
  growthRateRange: [number, number];
  climateUpliftRange: [number, number];
  assetPerformanceRange: [number, number];
  leakageRange: [number, number];
  baseDemandData: { [year: number]: number };
  baseSupplyData: { [year: number]: number };
}

export const useMonteCarloSimulation = () => {
  const getRandomInRange = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  // Extract the summarization function for convenience
  const summarizeResults = (
    runs: MonteCarloRun[],
    years: number[]
  ): MonteCarloSummaryByYear[] => {
    return years.map((year) => {
      const values = runs.map((run) => run.find((r) => r.year === year)!);
      const supplyVals = values.map((v) => v.supply);
      const demandVals = values.map((v) => v.demand);
      const shortfalls = values.map((v) => v.shortfall);

      return {
        year,
        medianSupply: percentile(supplyVals, 50),
        medianDemand: percentile(demandVals, 50),
        percentile5: percentile(shortfalls, 5),
        percentile95: percentile(shortfalls, 95),
        probabilityOfShortfall: shortfalls.filter((v) => v > 0).length / shortfalls.length,
      };
    });
  };

  // New asynchronous simulation function that reports progress
  const runSimulationWithProgress = useCallback(
    async (
      {
        numRuns,
        years,
        growthRateRange,
        climateUpliftRange,
        assetPerformanceRange,
        leakageRange,
        baseDemandData,
        baseSupplyData,
      }: RunSimulationParams,
      onProgress: (progress: number) => void
    ): Promise<MonteCarloResults> => {
      const runs: MonteCarloRun[] = [];
      // Decide how many runs per chunk before updating progress.
      // Here we update for every 1% completion.
      const chunkSize = Math.ceil(numRuns / 100);

      for (let i = 0; i < numRuns; i++) {
        const run: MonteCarloRun = years.map((year) => {
          const baseDemand = baseDemandData[year] || 0;
          const baseSupply = baseSupplyData[year] || 0;

          const growthRate = getRandomInRange(...growthRateRange);
          const uplift = getRandomInRange(...climateUpliftRange);
          const assetFactor = getRandomInRange(...assetPerformanceRange);
          const leakageReduction = getRandomInRange(...leakageRange);

          // Apply the simulation formula based on your baseline data:
          const simulatedDemand = baseDemand * (1 + growthRate / 100) * (1 - leakageReduction);
          const simulatedSupply = baseSupply * (1 + assetFactor / 100) * (1 - uplift);
          const shortfall = Math.max(0, simulatedDemand - simulatedSupply);

          return { year, demand: simulatedDemand, supply: simulatedSupply, shortfall };
        });
        runs.push(run);

        // Update progress every chunkSize iterations.
        if (i % chunkSize === 0) {
          onProgress(Math.min((i / numRuns) * 100, 100));
          // Yield to the main thread so the progress bar updates.
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }

      onProgress(100); // Ensure progress finishes at 100%
      const summary = summarizeResults(runs, years);
      return { runs, summary };
    },
    []
  );

  // Return the asynchronous simulation function
  return { runSimulation: runSimulationWithProgress };
};
