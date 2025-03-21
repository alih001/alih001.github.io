// DemandSupplyChart.tsx
import React from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";

interface DemandSupplyChartProps {
  demandData: { yearlyDemand: Record<string, number> } | null;
  supplyData: {
    yearlySupply: Record<string, number>;
    droughtAdjustments?: {
      "1/500"?: Record<string, number>;
      "1/200"?: Record<string, number>;
      "1/100"?: Record<string, number>;
    };
  } | null;
  drought: string; // "None", "1/500", "1/200", or "1/100"
}

const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const width = 800;
const height = 400;

const DemandSupplyChart: React.FC<DemandSupplyChartProps> = ({
  demandData,
  supplyData,
  drought,
}) => {
  if (!demandData || !supplyData) {
    return <div>No data available for the selected filters.</div>;
  }

  // Get sorted years from the demand data (assumes both datasets share the same years)
  const years = Object.keys(demandData.yearlyDemand).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Compute the maximum Y value from both demand and adjusted supply for scaling.
  const demandValues = years.map((year) => demandData.yearlyDemand[year]);
  const supplyValues = years.map((year) => {
    const baseSupply = supplyData.yearlySupply[year] || 0;
    let adjustment = 0;
    if (
      drought !== "None" &&
      supplyData.droughtAdjustments &&
      supplyData.droughtAdjustments[drought]
    ) {
      adjustment = supplyData.droughtAdjustments[drought][year] || 0;
    }
    return baseSupply - adjustment;
  });
  const maxDemand = Math.max(...demandValues);
  const maxSupply = Math.max(...supplyValues);
  const maxY = Math.max(maxDemand, maxSupply) * 1.1; // add 10% headroom

  // xScale using scaleBand for discrete years.
  const xScale = scaleBand<string>({
    domain: years,
    range: [margin.left, width - margin.right],
    padding: 0.2,
  });

  // yScale using scaleLinear for numeric values.
  const yScale = scaleLinear<number>({
    domain: [0, maxY],
    range: [height - margin.bottom, margin.top],
  });

  // Prepare data for the demand line.
  const lineData = years.map((year) => {
    const x = (xScale(year) || 0) + xScale.bandwidth() / 2;
    return {
      year,
      value: demandData.yearlyDemand[year],
      x,
      y: yScale(demandData.yearlyDemand[year]),
    };
  });

  return (
    <svg width={width} height={height}>
      {/* Supply Bars */}
      <Group>
        {years.map((year) => {
          const x = xScale(year);
          const baseSupply = supplyData.yearlySupply[year] || 0;
          let adjustment = 0;
          if (
            drought !== "None" &&
            supplyData.droughtAdjustments &&
            supplyData.droughtAdjustments[drought]
          ) {
            adjustment = supplyData.droughtAdjustments[drought][year] || 0;
          }
          const effectiveSupply = baseSupply - adjustment;
          const barHeight = height - margin.bottom - yScale(effectiveSupply);
          return (
            <Bar
              key={`bar-${year}`}
              x={x}
              y={yScale(effectiveSupply)}
              width={xScale.bandwidth()}
              height={barHeight}
              fill="orange"
            />
          );
        })}
      </Group>

      {/* Demand Line */}
      <LinePath
        data={lineData}
        x={(d) => d.x}
        y={(d) => d.y}
        stroke="blue"
        strokeWidth={2}
        curve={curveMonotoneX}
      />

      {/* X Axis */}
      <AxisBottom
        top={height - margin.bottom}
        scale={xScale}
        stroke="black"
        tickStroke="black"
        tickLabelProps={() => ({
          fill: "black",
          fontSize: 10,
          textAnchor: "middle",
        })}
      />

      {/* Y Axis */}
      <AxisLeft
        left={margin.left}
        scale={yScale}
        stroke="black"
        tickStroke="black"
        tickLabelProps={() => ({
          fill: "black",
          fontSize: 10,
          textAnchor: "end",
          dx: "-0.25em",
        })}
      />
    </svg>
  );
};

export default DemandSupplyChart;
