import React, { useState } from "react";
import styled from "styled-components";
import { useMonteCarloSimulation } from "../../hooks/useMonteCarloSimulation";
import { percentile } from "../../utils/statistics";
import { useChartData } from "../../hooks/useChartData";
import { useData } from "../../contexts/useDataContext";
import LoadingSpinner from "../custom_components/LoadingSpinner";
import { calculateTotalSupply } from "../../utils/calculateTotalSupply";

const Section = styled.section`
  margin-top: 1.5rem;
`;

const SectionHeader = styled.h4`
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2e6ef7;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  margin-top: 1rem;

  &:hover {
    background-color: #204ecf;
  }
`;

interface MonteCarloTabProps {
  setResults: (r: any) => void;
}

const MonteCarloTab: React.FC<MonteCarloTabProps> = ({ setResults }) => {
  const { demandForChart, supplyForChart, activeSimulation } = useChartData();
  const { customAssets, getCurrentWRZState } = useData();
  const { selectedAssets, assetSettings } = getCurrentWRZState();

  if (
    !demandForChart ||
    !demandForChart.yearlyDemand ||
    !supplyForChart ||
    !supplyForChart.yearlySupply
  ) {
    return <div>Loading data...</div>;
  }

  // Use the keys from demand data to create the simulation years.
  const simulationYears = Object.keys(demandForChart.yearlyDemand)
    .map(Number)
    .sort((a, b) => a - b);

  // Compute the "total" supply using your stacked supply logic.
  const computedTotalSupply = calculateTotalSupply(
    supplyForChart.yearlySupply,             // raw supply data
    supplyForChart.droughtAdjustments,         // drought adjustments (if available)
    activeSimulation,                          // simulation config (e.g., drought override, asset deterioration)
    supplyForChart.drought || "None",          // current drought scenario
    customAssets,                              // from your useData context
    assetSettings,                             // from your useData context
    selectedAssets                             // from your useData context
  );

  const [numRuns, setNumRuns] = useState(500);
  const [isRunning, setIsRunning] = useState(false);

  const { runSimulation } = useMonteCarloSimulation();

  const [growthRateMin, setGrowthRateMin] = useState(1.5);
  const [growthRateMax, setGrowthRateMax] = useState(2.5);
  const [climateUpliftMin, setClimateUpliftMin] = useState(0);
  const [climateUpliftMax, setClimateUpliftMax] = useState(0.2);
  const [assetPerformanceMin, setAssetPerformanceMin] = useState(0.8);
  const [assetPerformanceMax, setAssetPerformanceMax] = useState(1.0);
  const [leakageMin, setLeakageMin] = useState(0.08);
  const [leakageMax, setLeakageMax] = useState(0.12);

  const summarizeResults = (runs: any[]) => {
    const summary = simulationYears.map((year) => {
      const values = runs.map((run) => run.find((r: any) => r.year === year));
      const supplyVals = values.map((v: any) => v.supply);
      const demandVals = values.map((v: any) => v.demand);
      const shortfalls = values.map((v: any) => v.shortfall);

      return {
        year,
        medianSupply: percentile(supplyVals, 50),
        medianDemand: percentile(demandVals, 50),
        percentile5: percentile(shortfalls, 5),
        percentile95: percentile(shortfalls, 95),
        probabilityOfShortfall:
          shortfalls.filter((v: number) => v > 0).length / shortfalls.length,
      };
    });
    return summary;
  };

  const handleRunSimulation = async () => {
    setIsRunning(true);

    // IMPORTANT: Pass computedTotalSupply here!
    const simulation = await runSimulation(
      {
        numRuns,
        years: simulationYears,
        growthRateRange: [growthRateMin, growthRateMax],
        climateUpliftRange: [climateUpliftMin, climateUpliftMax],
        assetPerformanceRange: [assetPerformanceMin, assetPerformanceMax],
        leakageRange: [leakageMin, leakageMax],
        baseDemandData: demandForChart.yearlyDemand,
        baseSupplyData: computedTotalSupply, // using our computed total supply
      },
      (p: number) => {
        // Progress callback if needed
      }
    );

    const summary = summarizeResults(simulation.runs);
    setResults({ ...simulation, summary });
    setIsRunning(false);
  };

  return (
    <>
      <Section>
        <SectionHeader>Monte Carlo Configuration</SectionHeader>
        <FieldGroup>
          <Label>Number of Simulation Runs</Label>
          <Input
            type="number"
            value={numRuns}
            onChange={(e) => setNumRuns(Number(e.target.value))}
          />
        </FieldGroup>

        <SectionHeader>Variable Ranges</SectionHeader>

        <FieldGroup>
          <Label>Growth Rate Range (%)</Label>
          <InputRow>
            <Input
              type="number"
              value={growthRateMin}
              onChange={(e) => setGrowthRateMin(Number(e.target.value))}
            />
            <Input
              type="number"
              value={growthRateMax}
              onChange={(e) => setGrowthRateMax(Number(e.target.value))}
            />
          </InputRow>
        </FieldGroup>

        <FieldGroup>
          <Label>Climate Uplift Factor Range (0–1)</Label>
          <InputRow>
            <Input
              type="number"
              value={climateUpliftMin}
              onChange={(e) => setClimateUpliftMin(Number(e.target.value))}
            />
            <Input
              type="number"
              value={climateUpliftMax}
              onChange={(e) => setClimateUpliftMax(Number(e.target.value))}
            />
          </InputRow>
        </FieldGroup>

        <FieldGroup>
          <Label>Asset Performance Range (DO %)</Label>
          <InputRow>
            <Input
              type="number"
              value={assetPerformanceMin}
              onChange={(e) => setAssetPerformanceMin(Number(e.target.value))}
            />
            <Input
              type="number"
              value={assetPerformanceMax}
              onChange={(e) => setAssetPerformanceMax(Number(e.target.value))}
            />
          </InputRow>
        </FieldGroup>

        <FieldGroup>
          <Label>Leakage Reduction Effectiveness (%)</Label>
          <InputRow>
            <Input
              type="number"
              value={leakageMin}
              onChange={(e) => setLeakageMin(Number(e.target.value))}
            />
            <Input
              type="number"
              value={leakageMax}
              onChange={(e) => setLeakageMax(Number(e.target.value))}
            />
          </InputRow>
        </FieldGroup>

        <Button onClick={handleRunSimulation} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Monte Carlo Simulation"}
        </Button>

        {isRunning && <LoadingSpinner />}
      </Section>
    </>
  );
};

export default MonteCarloTab;
