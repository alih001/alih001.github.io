// CostChart.tsx
import React from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { CustomAssetRow } from "../../types/public-types";
import { getColourForAsset } from "../../utils/getColourForAsset";

interface CostChartProps {
  customAssets: CustomAssetRow[]; // Parsed custom asset data per year
  selectedAssets: Set<string>; // Currently implemented assets
}

const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const chartWidth = 600;
const chartHeight = 300;

const CostChart: React.FC<CostChartProps> = ({
  customAssets,
  selectedAssets,
}) => {
  // Extract and sort the years from customAssets.
  const years = customAssets.map((row) => row.year).sort((a, b) => a - b);

  // Convert the Set of selected assets to a sorted array for consistent color assignment.
  const selectedAssetsArray = Array.from(selectedAssets).sort();

  // Build stacked cost data.
  // For each year, create an array of segments – one for each selected asset.
  const stackedCostData = years.map((year) => {
    // Find the row corresponding to this year.
    const assetRow = customAssets.find((row) => row.year === year);
    const segments: { label: string; value: number; color: string }[] = [];

    // For each selected asset, add its cost for that year.
    selectedAssetsArray.forEach((assetName, index) => {
      const assetCost = assetRow ? assetRow.assets[assetName]?.cost ?? 0 : 0;
      segments.push({
        label: assetName,
        value: assetCost,
        color: getColourForAsset(index, selectedAssetsArray.length),
      });
    });
    return { year, segments };
  });

  // Calculate total cost per year (sum of segments).
  const costTotals = stackedCostData.map((row) =>
    row.segments.reduce((sum, seg) => sum + seg.value, 0)
  );
  const maxCost = Math.max(...costTotals);

  // Create scales.
  const xScale = scaleBand<number>({
    domain: years,
    range: [margin.left, margin.left + chartWidth],
    padding: 0.2,
  });
  const yScale = scaleLinear<number>({
    domain: [0, maxCost],
    range: [margin.top + chartHeight, margin.top],
  });

  return (
    <svg
      width={margin.left + chartWidth + margin.right}
      height={margin.top + chartHeight + margin.bottom}
    >
      <Group left={0} top={0}>
        {stackedCostData.map((data) => {
          const x = xScale(data.year);
          let cumulative = 0;
          return data.segments.map((seg, i) => {
            const y0 = yScale(cumulative);
            cumulative += seg.value;
            const y1 = yScale(cumulative);
            const segHeight = y0 - y1;
            return (
              <Bar
                key={`bar-${data.year}-${i}`}
                x={x}
                y={y1}
                width={xScale.bandwidth()}
                height={segHeight}
                fill={seg.color}
              />
            );
          });
        })}
      </Group>

      {/* X Axis */}
      <AxisBottom
        top={margin.top + chartHeight}
        scale={xScale}
        tickFormat={(val) => val.toString()}
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

export default CostChart;
