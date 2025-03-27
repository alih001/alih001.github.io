import React, { useMemo, useState } from "react";
import styled from "styled-components";
import LargeModal from "../custom_components/LargeModal";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { useData } from "../../contexts/useDataContext";
import { useChartData } from "../../hooks/useChartData";

const ModalHeader = styled.h3`
  text-align: center;
  margin-bottom: 16px;
  font-size: 1.5rem;
  color: #333;
`;

const Dropdown = styled.select`
  display: block;
  width: 220px;
  margin: 0 auto 16px auto;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const PieWrapper = styled.div`
  width: 100%;
  margin: 0 auto 16px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LegendWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 auto 16px auto;
  font-size: 0.9rem;
  color: #333;
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendColor = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 3px;
`;

const StyledButton = styled.button`
  display: block;
  width: 220px;
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin: 16px auto 0 auto;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// New SVG dimensions.
const svgWidth = 900;
const svgHeight = 600;
const outerRadius = 200; // reduced for a shorter SVG height
const padAngle = 0.01;

interface WRZBreakdownModalProps {
  onClose: () => void;
}

const WRZBreakdownModal: React.FC<WRZBreakdownModalProps> = ({ onClose }) => {
  const {
    activeWRZ,
    wrzSummary,
    filterCriteria,
    customAssets,
    getCurrentWRZState,
  } = useData();
  const { demandForChart, supplyForChart } = useChartData();

  // Compute available years dynamically from demandForChart.yearlyDemand.
  const availableYears = useMemo(() => {
    if (demandForChart?.yearlyDemand) {
      return Object.keys(demandForChart.yearlyDemand)
        .map(Number)
        .sort((a, b) => a - b);
    }
    return [new Date().getFullYear()];
  }, [demandForChart]);

  const [selectedYear, setSelectedYear] = useState<number>(availableYears[0]);
  const yearStr = selectedYear.toString();

  if (!activeWRZ || !wrzSummary[activeWRZ]) {
    return null;
  }

  // Extract summary values.
  const { leakage, legalUnbilled, illegalUnbilled } = wrzSummary[activeWRZ];

  // Compute base supply from supplyForChart using same logic as DemandSupplyChart.
  const computeBaseSupply = (year: number) => {
    const yStr = year.toString();
    const baseSupply = supplyForChart?.yearlySupply[yStr] || 0;
    const effectiveDrought = filterCriteria.drought || "None";
    const droughtAdjustment =
      supplyForChart?.droughtAdjustments?.[effectiveDrought]?.[yStr] || 0;
    return Math.max(0, baseSupply - droughtAdjustment);
  };

  // Compute asset contributions using selected assets from current WRZ state.
  const computeAssetContributions = (year: number) => {
    let total = 0;
    const { selectedAssets, assetSettings } = getCurrentWRZState();
    Array.from(selectedAssets).forEach((assetName) => {
      const assetRows = customAssets.filter(
        (row) => row.assets[assetName] !== undefined
      );
      const baseStartYear =
        assetRows.length > 0
          ? Math.min(...assetRows.map((row) => row.year))
          : year;
      const settings = assetSettings[assetName] || {
        doPercentage: 100,
        startYear: baseStartYear,
      };
      const doPercentage = settings.doPercentage;
      const shift = settings.startYear - baseStartYear;
      const effectiveYear = year - shift;
      let effectiveAssetDO = 0;
      if (effectiveYear >= baseStartYear) {
        effectiveAssetDO =
          customAssets.find((row) => row.year === effectiveYear)?.assets?.[
            assetName
          ]?.do || 0;
      }
      total += effectiveAssetDO * (doPercentage / 100);
    });
    return total;
  };

  const baseEffective = computeBaseSupply(selectedYear);
  const assetContribution = computeAssetContributions(selectedYear);

  // Get demand for selected year.
  const demand =
    demandForChart && demandForChart.yearlyDemand[yearStr]
      ? Number(demandForChart.yearlyDemand[yearStr])
      : 0;

  // Now, we want to show these as separate slices.
  // Instead of combining them, we cap each segment at the available demand.
  const baseSupplySlice = Math.min(baseEffective, demand);
  const remainingAfterBase = Math.max(0, demand - baseSupplySlice);
  const assetContributionSlice = Math.min(
    assetContribution,
    remainingAfterBase
  );
  const combinedSupply = baseSupplySlice + assetContributionSlice;
  const missingDemand = Math.max(0, demand - combinedSupply);

  const slices = [
    { label: "Base Supply", value: baseSupplySlice, color: "#2e6ef7" },
    {
      label: "Asset Contributions",
      value: assetContributionSlice,
      color: "#6a8fdc",
    },
    { label: "Leakage", value: leakage, color: "#f9c74f" },
    { label: "Water Taken Legally", value: legalUnbilled, color: "#f9844a" },
    {
      label: "Water Taken Illegally",
      value: illegalUnbilled,
      color: "#f94144",
    },
    { label: "Missing Demand", value: missingDemand, color: "#999" },
  ].filter((slice) => slice.value > 0);

  console.log("=== WRZ Breakdown Debug ===");
  slices.forEach((slice) =>
    console.log(`${slice.label}: ${slice.value.toFixed(2)}`)
  );
  console.log(
    "Expected total (demand + losses):",
    demand + (leakage + legalUnbilled + illegalUnbilled)
  );

  return (
    <LargeModal onClose={onClose}>
      <ModalHeader>WRZ Breakdown - {activeWRZ}</ModalHeader>
      <Dropdown
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {availableYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Dropdown>
      {/* Use callouts: draw a line from the arc's centroid to the label positioned outside */}
      <PieWrapper>
        <svg width={svgWidth} height={svgHeight}>
          <Group top={svgHeight / 2} left={svgWidth / 2}>
            <Pie
              data={slices}
              pieValue={(d) => d.value}
              outerRadius={outerRadius}
              innerRadius={0}
              padAngle={padAngle}
            >
              {(pie) =>
                pie.arcs.map((arc) => {
                  const slice = arc.data;
                  const midAngle = (arc.startAngle + arc.endAngle) / 2;
                  const [centroidX, centroidY] = pie.path.centroid(arc);
                  // Set label radius: control how far out the callout is.
                  //   const labelRadius = 40;
                  const labelRadius = outerRadius + 20;
                  const labelX = Math.cos(midAngle) * labelRadius;
                  const labelY = Math.sin(midAngle) * labelRadius;
                  return (
                    <g key={slice.label}>
                      <path
                        d={pie.path(arc) || ""}
                        fill={slice.color}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                      <line
                        x1={centroidX}
                        y1={centroidY}
                        x2={labelX}
                        y2={labelY}
                        stroke={slice.color}
                        strokeWidth={1}
                      />
                      <text
                        x={labelX}
                        y={labelY}
                        fill="#333"
                        textAnchor={labelX > 0 ? "start" : "end"}
                        alignmentBaseline="middle"
                        fontSize={12}
                      >
                        {slice.label}: {slice.value.toFixed(2)} Ml/d
                      </text>
                    </g>
                  );
                })
              }
            </Pie>
          </Group>
        </svg>
      </PieWrapper>
      <StyledButton onClick={onClose}>Close</StyledButton>
    </LargeModal>
  );
};

export default WRZBreakdownModal;
