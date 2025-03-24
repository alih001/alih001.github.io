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

const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const width = 800;
const height = 400;

const DemandSupplyChart: React.FC<DemandSupplyChartProps> = ({
  demandData,
  supplyData,
  drought,
}) => {
  // Get customAssets and selectedAssets from context.
  const { customAssets, selectedAssets, assetSettings } = useData();

  if (!demandData || !supplyData) {
    return <div>No data available for the selected filters.</div>;
  }

  // Get sorted years from demand data (assumes both datasets share the same years)
  const years = Object.keys(demandData.yearlyDemand).sort(
    (a, b) => Number(a) - Number(b)
  );

  // Compute demand values (for scaling the y-axis)
  const demandValues = years.map((year) => demandData.yearlyDemand[year]);

  // Convert selectedAssets (a Set) to a sorted array for consistent color assignment.
  const selectedAssetsArray = Array.from(selectedAssets).sort();

  // Build stacked supply data:
  // For each year, create an array of segments:
  // - Base supply (after drought adjustment)
  // - One segment per selected asset with its deployable output.
  const stackedSupplyData = years.map((yearStr) => {
    const year = Number(yearStr);
    const baseSupply = supplyData.yearlySupply[yearStr] || 0;
    let droughtAdjustment = 0;
    if (
      drought !== "None" &&
      supplyData.droughtAdjustments &&
      supplyData.droughtAdjustments[drought]
    ) {
      droughtAdjustment = supplyData.droughtAdjustments[drought][yearStr] || 0;
    }
    // Effective base supply after drought adjustment:
    const baseEffective = Math.max(0, baseSupply - droughtAdjustment);

    // Begin with the base supply segment.
    const segments: { label: string; value: number; color: string }[] = [
      { label: "Base Supply", value: baseEffective, color: "orange" },
    ];

    // Add a segment for each selected asset.
    selectedAssetsArray.forEach((assetName, index) => {
      // Filter the customAssets rows to find rows for this asset.
      const assetRows = customAssets.filter(
        (row) => row.assets[assetName] !== undefined
      );
      // Determine the base start year for the asset.
      const baseStartYear =
        assetRows.length > 0
          ? Math.min(...assetRows.map((row) => row.year))
          : 2020;
      // Get settings for this asset.
      const settings = assetSettings[assetName] || {
        doPercentage: 100,
        startYear: baseStartYear,
      };
      // Calculate how many years to shift.
      const shift = settings.startYear - baseStartYear;
      // Compute the effective year: the base year corresponding to this chart year.
      const effectiveYear = year - shift;
      // Only apply the asset's DO if the effective year is at least the base start year.
      let effectiveAssetDO = 0;
      if (effectiveYear >= baseStartYear) {
        effectiveAssetDO =
          customAssets.find((row) => row.year === effectiveYear)?.assets[
            assetName
          ]?.do ?? 0;
      }
      // Apply the DO percentage slider.
      effectiveAssetDO = effectiveAssetDO * (settings.doPercentage / 100);

      segments.push({
        label: assetName,
        value: effectiveAssetDO,
        color: getColourForAsset(index, selectedAssetsArray.length),
      });
    });
    return { year, segments };
  });

  // Calculate the total supply per year for scaling.
  const supplyTotals = stackedSupplyData.map((row) =>
    row.segments.reduce((sum, seg) => sum + seg.value, 0)
  );
  const maxSupply = Math.max(...supplyTotals);
  const maxDemand = Math.max(...demandValues);
  const maxY = Math.max(maxSupply, maxDemand) * 1.1; // add 10% headroom

  // xScale for years (using number type)
  const xScale = scaleBand<number>({
    domain: years.map(Number),
    range: [margin.left, width - margin.right],
    padding: 0.2,
  });

  // yScale for supply/demand values.
  const yScale = scaleLinear<number>({
    domain: [0, maxY],
    range: [height - margin.bottom, margin.top],
  });

  // Prepare demand line data.
  const lineData = years.map((yearStr) => {
    const year = Number(yearStr);
    const x = (xScale(year) || 0) + xScale.bandwidth() / 2;
    return {
      year,
      value: demandData.yearlyDemand[yearStr],
      x,
      y: yScale(demandData.yearlyDemand[yearStr]),
    };
  });

  return (
    <svg width={width} height={height}>
      {/* Stacked Supply Bars */}
      <Group>
        {stackedSupplyData.map((data) => {
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
        tickFormat={(d) => d.toString()}
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
