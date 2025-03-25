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

const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const width = 800;
const height = 400;

const DemandSupplyChart: React.FC<DemandSupplyChartProps> = ({
  demandData,
  supplyData,
  simulatedDemandData,
  drought,
}) => {
  const { customAssets, getCurrentWRZState, simulation } = useData();
  const { selectedAssets, assetSettings } = getCurrentWRZState();

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
    console.log("Rendering Chart", {
      demandData,
      supplyData,
      simulatedDemandData,
    });

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
    const droughtAdjustment =
      (drought !== "None" &&
        supplyData.droughtAdjustments?.[drought]?.[yearStr]) ||
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
      const shift = settings.startYear - baseStartYear;
      const effectiveYear = year - shift;
      let effectiveAssetDO = 0;
      if (effectiveYear >= baseStartYear) {
        effectiveAssetDO =
          customAssets.find((row) => row.year === effectiveYear)?.assets?.[
            assetName
          ]?.do || 0;
      }
      effectiveAssetDO = effectiveAssetDO * (settings.doPercentage / 100);
      segments.push({
        label: assetName,
        value: effectiveAssetDO,
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

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "1rem",
        }}
      >
        {[
          { label: "Base Supply", color: "orange" },
          ...selectedAssetsArray.map((assetName, index) => ({
            label: assetName,
            color: getColourForAsset(index, selectedAssetsArray.length),
          })),
          simulation.active
            ? {
                label: "Simulated Demand",
                color: "purple",
                dashed: true,
              }
            : null,
        ]
          .filter(Boolean)
          .map((item) => (
            <div
              key={item.label}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              {item.dashed ? (
                <svg width={16} height={8}>
                  <line
                    x1={0}
                    y1={4}
                    x2={16}
                    y2={4}
                    stroke={item.color}
                    strokeWidth={2}
                    strokeDasharray="4,2"
                  />
                </svg>
              ) : (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: item.color,
                    borderRadius: "3px",
                  }}
                />
              )}
              <span style={{ fontSize: "12px" }}>{item.label}</span>
            </div>
          ))}
      </div>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          top={tooltipTop}
          left={tooltipLeft}
          applyPositionStyle
          style={{
            position: "absolute",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "0.75rem",
            fontSize: "12px",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
            zIndex: 9999,
            maxWidth: "240px",
          }}
        >
          <div>
            <strong>Year: {tooltipData.year}</strong>
          </div>
          <div>Demand: {tooltipData.demand.toFixed(2)} Ml/d</div>
          <div>Total Supply: {tooltipData.totalSupply.toFixed(2)} Ml/d</div>
          <div style={{ marginTop: "0.5rem" }}>
            {tooltipData.segments.map((seg, i) => (
              <div key={i}>
                <span style={{ color: seg.color, fontWeight: 600 }}>
                  {seg.label}:
                </span>{" "}
                {seg.value.toFixed(2)} Ml/d
              </div>
            ))}
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
};

export default DemandSupplyChart;
