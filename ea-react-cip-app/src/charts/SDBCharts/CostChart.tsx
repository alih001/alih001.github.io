// CostChart.tsx
import React from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";

interface CostChartProps {
  customAssets: CustomAssetRow[]; // e.g. the array described above
  selectedAssets: string[]; // currently implemented assets
}

const CostChart: React.FC<CostChartProps> = ({
  customAssets,
  selectedAssets,
}) => {
  // Extract the years from customAssets
  const years = customAssets.map((row) => row.year).sort();

  // Summation logic for each year
  const costPerYear = years.map((year) => {
    const row = customAssets.find((r) => r.year === year);
    let totalCost = 0;
    if (row) {
      for (const assetName of selectedAssets) {
        totalCost += row.assets[assetName]?.cost ?? 0;
      }
    }
    return totalCost;
  });

  // VisX scales for plotting
  const xScale = scaleBand<number>({
    domain: years,
    range: [0, 600], // adjust as needed
    padding: 0.2,
  });

  const maxCost = Math.max(...costPerYear);
  const yScale = scaleLinear<number>({
    domain: [0, maxCost],
    range: [300, 0], // adjust as needed
  });

  return (
    <svg width={700} height={400}>
      <Group left={50} top={50}>
        {years.map((year, i) => {
          const cost = costPerYear[i];
          const barX = xScale(year);
          const barY = yScale(cost);
          const barHeight = 300 - (barY ?? 0);
          return (
            <Bar
              key={year}
              x={barX}
              y={barY}
              width={xScale.bandwidth()}
              height={barHeight}
              fill="teal"
            />
          );
        })}
        <AxisBottom
          top={300}
          scale={xScale}
          tickFormat={(val) => val.toString()}
        />
        <AxisLeft scale={yScale} />
      </Group>
    </svg>
  );
};

export default CostChart;
