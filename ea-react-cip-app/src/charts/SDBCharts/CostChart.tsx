// CostChart.tsx
import React from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { CostChartProps } from "../../types/public-types";
import { getColourForAsset } from "../../utils/getColourForAsset";
import { useData } from "../../contexts/useDataContext";

const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const chartWidth = 600;
const chartHeight = 300;

const CostChart: React.FC<CostChartProps> = ({ customAssets }) => {
  const { getCurrentWRZState } = useData();
  const { selectedAssets, assetSettings } = getCurrentWRZState();

  // Extract and sort the years from customAssets.
  const years = customAssets.map((row) => row.year).sort((a, b) => a - b);

  // Convert the Set of selected assets to a sorted array for consistent color assignment.
  const selectedAssetsArray = Array.from(selectedAssets).sort();

  // Build stacked cost data.
  // For each year, create an array of segments – one for each selected asset.
  const stackedCostData = years.map((year) => {
    // For each chart year, "year" is a number.
    // For each asset, we calculate an offset.
    const segments: { label: string; value: number; color: string }[] = [];

    // For each selected asset, add its cost for that year.
    selectedAssetsArray.forEach((assetName, index) => {
      // Get the asset settings for this asset, with defaults.
      const settings = assetSettings[assetName] || {
        doPercentage: 100,
        startYear: 2020,
      };

      // Find all rows that have a cost for this asset.
      const assetRows = customAssets.filter(
        (row) => row.assets[assetName] !== undefined
      );
      // Determine the base start year for this asset.
      const baseStartYear =
        assetRows.length > 0
          ? Math.min(...assetRows.map((row) => row.year))
          : 2020;
      // Calculate how many years to shift the timeline.
      const shift = settings.startYear - baseStartYear;

      // For the current chart year, compute the effective year in the asset's base timeline.
      const effectiveYear = year - shift;
      // Look up the cost for that effective year.
      const assetCost =
        customAssets.find((row) => row.year === effectiveYear)?.assets[
          assetName
        ]?.cost ?? 0;

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
