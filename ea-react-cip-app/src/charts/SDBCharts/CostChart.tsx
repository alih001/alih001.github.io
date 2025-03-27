import React from "react";
import styled from "styled-components";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { CostChartProps } from "../../types/public-types";
import { getColourForAsset } from "../../utils/getColourForAsset";
import { useData } from "../../contexts/useDataContext";

const ChartContainer = styled.div`
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow-x: auto;
  margin-bottom: 1rem;
`;

const margin = { top: 20, right: 30, bottom: 50, left: 85 };
const chartWidth = 600;
const chartHeight = 300;
const svgWidth = margin.left + chartWidth + margin.right;
const svgHeight = margin.top + chartHeight + margin.bottom;

const CostChart: React.FC<CostChartProps> = ({ customAssets }) => {
  const { getCurrentWRZState } = useData();
  const { selectedAssets, assetSettings } = getCurrentWRZState();

  const years = customAssets.map((row) => row.year).sort((a, b) => a - b);
  const selectedAssetsArray = Array.from(selectedAssets).sort();

  // Build stacked cost data.
  const stackedCostData = years.map((year) => {
    const segments: { label: string; value: number; color: string }[] = [];
    selectedAssetsArray.forEach((assetName, index) => {
      const settings = assetSettings[assetName] || {
        doPercentage: 100,
        startYear: 2020,
      };

      const assetRows = customAssets.filter(
        (row) => row.assets[assetName] !== undefined
      );
      const baseStartYear =
        assetRows.length > 0
          ? Math.min(...assetRows.map((row) => row.year))
          : 2020;
      const shift = settings.startYear - baseStartYear;
      const effectiveYear = year - shift;
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

  const costTotals = stackedCostData.map((row) =>
    row.segments.reduce((sum, seg) => sum + seg.value, 0)
  );
  const maxCost = Math.max(...costTotals, 1); // Ensure non-zero for scale

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
    <ChartContainer>
      <svg width={svgWidth} height={svgHeight}>
        <Group>
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
        <AxisBottom
          top={margin.top + chartHeight}
          scale={xScale}
          tickFormat={(val) => val.toString()}
          stroke="#333"
          tickStroke="#333"
          tickLabelProps={() => ({
            fill: "#333",
            fontSize: 10,
            textAnchor: "middle",
          })}
        />
        <AxisLeft
          left={margin.left}
          scale={yScale}
          stroke="#333"
          tickStroke="#333"
          tickLabelProps={() => ({
            fill: "#333",
            fontSize: 10,
            textAnchor: "end",
            dx: "-0.25em",
          })}
        />
        {/* Y Axis Label */}
        <text
          x={-chartHeight / 2 - margin.top}
          y={15}
          transform="rotate(-90)"
          textAnchor="middle"
          fill="#333"
          fontSize={12}
        >
          Cost
        </text>
        {/* X Axis Label */}
        <text
          x={svgWidth / 2}
          y={svgHeight - 10}
          textAnchor="middle"
          fill="#333"
          fontSize={12}
        >
          Year
        </text>
      </svg>
    </ChartContainer>
  );
};

export default CostChart;
