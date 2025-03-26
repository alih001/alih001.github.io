// DemandSupplyChart.tsx
import React from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { useData } from "../../contexts/useDataContext";
import { getColourForAsset } from "../../utils/getColourForAsset";
import { DemandSupplyChartProps } from "../../types/public-types";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { useChartData } from "../../hooks/useChartData";
const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const width = 800;
const height = 400;

const DemandSupplyChart: React.FC<DemandSupplyChartProps> = ({
  demandData,
  supplyData,
  simulatedDemandData,
  drought,
}) => {
  const { customAssets, getCurrentWRZState } = useData();
  const { selectedAssets, assetSettings } = getCurrentWRZState();
  const { activeSimulation } = useChartData();

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  if (!demandData || !supplyData) {
    return <div>No data available for the selected filters.</div>;
  }

  const years = Object.keys(demandData.yearlyDemand).sort(
    (a, b) => Number(a) - Number(b)
  );
  const demandValues = years.map(
    (year) => Number(demandData.yearlyDemand[year]) || 0
  );
  const selectedAssetsArray = Array.from(selectedAssets).sort();

  const stackedSupplyData = years.map((yearStr) => {
    const year = Number(yearStr);
    const baseSupply = supplyData.yearlySupply[yearStr] || 0;
    const effectiveDrought =
      activeSimulation?.config?.droughtOverride ?? drought;
    const droughtAdjustment =
      (effectiveDrought !== "None" &&
        supplyData.droughtAdjustments?.[effectiveDrought]?.[yearStr]) ||
      0;

    const baseEffective = Math.max(0, baseSupply - droughtAdjustment);

    const segments = [
      { label: "Base Supply", value: baseEffective, color: "orange" },
    ];

    selectedAssetsArray.forEach((assetName, index) => {
      const assetRows = customAssets.filter(
        (row) => row.assets[assetName] !== undefined
      );
      const baseStartYear =
        assetRows.length > 0
          ? Math.min(...assetRows.map((row) => row.year))
          : 2020;

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

      effectiveAssetDO = effectiveAssetDO * (doPercentage / 100);

      const yearsSinceStart = Math.max(0, year - settings.startYear);
      // const decayRate = activeSimulation?.config.assetDeterioration ?? 0;
      const decayRate = Math.min(
        activeSimulation?.config.assetDeterioration ?? 0,
        20
      ); // 20% max

      const decayedDO =
        effectiveAssetDO * Math.pow(1 - decayRate / 100, yearsSinceStart);

      segments.push({
        label: assetName,
        value: decayedDO,
        color: getColourForAsset(index, selectedAssetsArray.length),
      });
    });

    return { year, segments };
  });

  const supplyTotals = stackedSupplyData.map((row) =>
    row.segments.reduce((sum, seg) => sum + seg.value, 0)
  );
  const maxSupply = Math.max(...supplyTotals);
  const maxDemand = Math.max(...demandValues);
  const maxY = Math.max(maxSupply, maxDemand) * 1.1;

  const xScale = scaleBand<number>({
    domain: years.map(Number),
    range: [margin.left, width - margin.right],
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    domain: [0, maxY],
    range: [height - margin.bottom, margin.top],
  });

  const lineData = years.map((yearStr) => {
    const year = Number(yearStr);
    const x = (xScale(year) || 0) + xScale.bandwidth() / 2;
    const value = Number(demandData.yearlyDemand[yearStr]) || 0;
    return { year, value, x, y: yScale(value) };
  });

  const simLineData = simulatedDemandData
    ? years.map((yearStr) => {
        const year = Number(yearStr);
        const x = (xScale(year) || 0) + xScale.bandwidth() / 2;
        const value = Number(simulatedDemandData.yearlyDemand[yearStr]) || 0;
        return { year, value, x, y: yScale(value) };
      })
    : [];

  return (
    <div
      style={{ position: "relative", zIndex: 9999, overflow: "visible" }}
      ref={containerRef}
    >
      <svg width={width} height={height}>
        <Group>
          {stackedSupplyData.map((data) => {
            const x = xScale(data.year);
            let cumulative = 0;
            return (
              <g key={`bar-group-${data.year}`}>
                {data.segments.map((seg, i) => {
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
                })}

                <rect
                  x={x}
                  y={margin.top}
                  width={xScale.bandwidth()}
                  height={height - margin.top - margin.bottom}
                  fill="transparent"
                  style={{ pointerEvents: "all" }}
                  onMouseMove={(e) => {
                    const coords = localPoint(e) || { x: 0, y: 0 };
                    const demand =
                      Number(demandData.yearlyDemand[data.year]) || 0;
                    const totalSupply = data.segments.reduce(
                      (sum, seg) => sum + seg.value,
                      0
                    );
                    showTooltip({
                      tooltipData: {
                        year: data.year,
                        demand,
                        totalSupply,
                        segments: data.segments,
                      },
                      tooltipLeft: coords.x,
                      tooltipTop: coords.y,
                    });
                  }}
                  onMouseLeave={hideTooltip}
                />
              </g>
            );
          })}
        </Group>

        <LinePath
          data={lineData}
          x={(d) => d.x}
          y={(d) => d.y}
          stroke="blue"
          strokeWidth={2}
          curve={curveMonotoneX}
        />

        {simLineData.length > 0 && (
          <LinePath
            data={simLineData}
            x={(d) => d.x}
            y={(d) => d.y}
            stroke="purple"
            strokeWidth={2}
            strokeDasharray="6,4"
            curve={curveMonotoneX}
          />
        )}

        <AxisBottom
          top={height - margin.bottom}
          scale={xScale}
          tickFormat={(d) => d.toString()}
          stroke="black"
          tickStroke="black"
          tickLabelProps={() => ({
            fill: "black",
            fontSize: 10,
            textAnchor: "middle",
          })}
        />

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

        <text
          x={-height / 2}
          y={15}
          transform="rotate(-90)"
          textAnchor="middle"
          fill="black"
          fontSize={12}
        >
          Deployable Output (Ml/d)
        </text>
        <text
          x={width / 2}
          y={height - 5}
          textAnchor="middle"
          fill="black"
          fontSize={12}
        >
          Year
        </text>
      </svg>
    </div>
  );
};

export default DemandSupplyChart;
