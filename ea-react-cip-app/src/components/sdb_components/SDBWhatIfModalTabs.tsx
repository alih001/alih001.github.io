import React, { useState } from "react";
import styled from "styled-components";
import WhatIfParametersTab from "./WhatIfParametersTab";
import MonteCarloTab from "./MonteCarloTab";
import MonteCarloResultsTab from "./MonteCarloResultsTab";
import { MonteCarloResults } from "../../hooks/useMonteCarloSimulation";
import { useChartData } from "../../hooks/useChartData";
import { useData } from "../../contexts/useDataContext";
import { calculateTotalSupply } from "../../utils/calculateTotalSupply";

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? "#2e6ef7" : "#eee")};
  color: ${({ active }) => (active ? "#fff" : "#333")};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: ${({ active }) => (active ? "#204ecf" : "#ddd")};
  }
`;

const TabPanel = styled.div`
  background: #fff;
  padding: 1rem 0;
`;

type TabOption = "parameters" | "montecarlo" | "results";

const WhatIfModalTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabOption>("parameters");
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResults | null>(null);

  // Get processed chart data
  const { demandForChart, supplyForChart, activeSimulation } = useChartData();
  // Get additional data needed for supply calculation from useData
  const { customAssets, getCurrentWRZState } = useData();
  const { selectedAssets, assetSettings } = getCurrentWRZState();

  // Check that baseline data is available
  if (
    !demandForChart ||
    !demandForChart.yearlyDemand ||
    !supplyForChart ||
    !supplyForChart.yearlySupply
  ) {
    return <div>Loading data...</div>;
  }

  // Compute the total (stacked) supply using our utility function.
  // supplyForChart is assumed to hold:
  // - yearlySupply: the raw base supply data,
  // - droughtAdjustments: any drought adjustments,
  // - drought: the current drought scenario.
  const computedTotalSupply = calculateTotalSupply(
    supplyForChart.yearlySupply,
    supplyForChart.droughtAdjustments, // adjust this key based on your data
    activeSimulation,
    supplyForChart.drought || "None",
    customAssets,
    assetSettings,
    selectedAssets
  );

  return (
    <>
      <TabContainer>
        <TabButton
          active={activeTab === "parameters"}
          onClick={() => setActiveTab("parameters")}
        >
          What-If Parameters
        </TabButton>
        <TabButton
          active={activeTab === "montecarlo"}
          onClick={() => setActiveTab("montecarlo")}
        >
          Monte Carlo Analysis
        </TabButton>
        {monteCarloResults && (
          <TabButton
            active={activeTab === "results"}
            onClick={() => setActiveTab("results")}
          >
            Results
          </TabButton>
        )}
      </TabContainer>
      <TabPanel>
        {activeTab === "parameters" && <WhatIfParametersTab />}
        {activeTab === "montecarlo" && (
          <MonteCarloTab setResults={setMonteCarloResults} />
        )}
        {activeTab === "results" && monteCarloResults && (
          <MonteCarloResultsTab
            results={monteCarloResults}
            // Pass in the baseline demand from the chart hook (unchanged)
            baselineDemand={demandForChart.yearlyDemand}
            // Pass in the computed total (stacked) supply value
            baselineSupply={computedTotalSupply}
          />
        )}
      </TabPanel>
    </>
  );
};

export default WhatIfModalTabs;
