import React, { useState } from "react";
import styled from "styled-components";
import { MonteCarloSummaryByYear } from "../../hooks/useMonteCarloSimulation";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath, AreaClosed } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";

const ChartContainer = styled.div`
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  position: relative;
`;

const SectionHeader = styled.h4`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const Legend = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #333;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LegendColor = styled.div<{ color: string; dashed?: boolean }>`
  width: 20px;
  height: 3px;
  background-color: ${({ color }) => color};
  ${({ dashed }) => dashed && "border-top: 1px dashed black; background: none;"}
`;

// Styling for the data table
const DataPreviewContainer = styled.div`
  margin-top: 1rem;
  overflow-x: auto;
`;

const DataTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  min-width: 600px;
`;

const TableHeader = styled.th`
  border: 1px solid #ccc;
  padding: 0.5rem;
  background: #eee;
  font-size: 0.9rem;
  text-align: center;
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  padding: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
`;

const ToggleButton = styled.button`
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  background: #2e6ef7;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background: #204ecf;
  }
`;

const width = 800;
const height = 400;
const margin = { top: 20, right: 30, bottom: 50, left: 60 };

interface MonteCarloResultsTabProps {
  results: {
    summary: MonteCarloSummaryByYear[];
  };
  baselineDemand: { [year: number]: number };
  baselineSupply: { [year: number]: number };
}

const MonteCarloResultsTab: React.FC<MonteCarloResultsTabProps> = ({
  results,
  baselineDemand,
  baselineSupply,
}) => {
  const data = results.summary;

  // For the main shadow-band chart
  const xValue = (d: MonteCarloSummaryByYear) => new Date(d.year, 0, 1);

  const xScale = scaleTime<Date>({
    domain: [xValue(data[0]), xValue(data[data.length - 1])],
    range: [margin.left, width - margin.right],
  });

  const allY = data.flatMap((d) => [d.percentile5, d.percentile95, d.medianSupply, d.medianDemand]);
  const yScale = scaleLinear<number>({
    domain: [Math.min(...allY) * 0.95, Math.max(...allY) * 1.05],
    range: [height - margin.bottom, margin.top],
    nice: true,
  });

  const baselineDemandLineData = data.map((d) => ({
    year: d.year,
    date: new Date(d.year, 0, 1),
    value: baselineDemand?.[d.year] ?? 0,
  }));
  const baselineSupplyLineData = data.map((d) => ({
    year: d.year,
    date: new Date(d.year, 0, 1),
    value: baselineSupply?.[d.year] ?? 0,
  }));

  // Probability data remains unchanged here
  const probabilityData = data.map((d) => ({
    year: d.year,
    date: new Date(d.year, 0, 1),
    probability: d.probabilityOfShortfall,
  }));

  const probabilityYScale = scaleLinear<number>({
    domain: [0, 1],
    range: [height - margin.bottom, margin.top],
    nice: true,
  });

  // Toggle state for data preview table
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <SectionHeader>Supply & Demand Shadow Band</SectionHeader>
      <ChartContainer>
        <svg width={width} height={height}>
          <Group>
            {/* Simulation Shadow Band */}
            <AreaClosed
              data={data}
              x={(d) => xScale(xValue(d))}
              y0={(d) => yScale(d.percentile5)}
              y1={(d) => yScale(d.percentile95)}
              fill="#2e6ef7"
              opacity={0.2}
            />
            {/* Simulation Median Supply */}
            <LinePath
              data={data}
              x={(d) => xScale(xValue(d))}
              y={(d) => yScale(d.medianSupply)}
              stroke="#2e6ef7"
              strokeWidth={2}
              curve={curveMonotoneX}
            />
            {/* Simulation Median Demand */}
            <LinePath
              data={data}
              x={(d) => xScale(xValue(d))}
              y={(d) => yScale(d.medianDemand)}
              stroke="#f9844a"
              strokeWidth={2}
              strokeDasharray="4,2"
              curve={curveMonotoneX}
            />
            {/* Baseline Supply (Original) */}
            <LinePath
              data={baselineSupplyLineData}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(d.value)}
              stroke="gray"
              strokeWidth={2}
              strokeDasharray="3,3"
              curve={curveMonotoneX}
            />
            {/* Baseline Demand (Original) */}
            <LinePath
              data={baselineDemandLineData}
              x={(d) => xScale(d.date)}
              y={(d) => yScale(d.value)}
              stroke="black"
              strokeWidth={2}
              strokeDasharray="3,3"
              curve={curveMonotoneX}
            />
          </Group>

          <AxisBottom
            top={height - margin.bottom}
            scale={xScale}
            tickFormat={(v) => new Date(v).getFullYear().toString()}
            tickLabelProps={() => ({
              fill: "#333",
              fontSize: 11,
              textAnchor: "middle",
            })}
          />

          <AxisLeft
            left={margin.left}
            scale={yScale}
            tickLabelProps={() => ({
              fill: "#333",
              fontSize: 11,
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.25em",
            })}
          />

          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize={12}
            fill="#333"
          >
            Year
          </text>

          <text
            x={-height / 2}
            y={15}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize={12}
            fill="#333"
          >
            Ml/d
          </text>
        </svg>

        <Legend>
          <LegendItem>
            <LegendColor color="#2e6ef7" /> Simulation Median Supply
          </LegendItem>
          <LegendItem>
            <LegendColor color="#f9844a" dashed /> Simulation Median Demand
          </LegendItem>
          <LegendItem>
            <LegendColor color="#2e6ef7" /> Shadow Band (5–95% Shortfall)
          </LegendItem>
          <LegendItem>
            <LegendColor color="gray" dashed /> Baseline Supply
          </LegendItem>
          <LegendItem>
            <LegendColor color="black" dashed /> Baseline Demand
          </LegendItem>
        </Legend>
      </ChartContainer>

      <SectionHeader>Probability of Shortfall Over Time</SectionHeader>
      <ChartContainer>
        <svg width={width} height={height}>
          <Group>
            <LinePath
              data={probabilityData}
              x={(d) => xScale(d.date)}
              y={(d) => probabilityYScale(d.probability)}
              stroke="#d9534f"
              strokeWidth={2}
              curve={curveMonotoneX}
            />
          </Group>

          <AxisBottom
            top={height - margin.bottom}
            scale={xScale}
            tickFormat={(v) => new Date(v).getFullYear().toString()}
            tickLabelProps={() => ({
              fill: "#333",
              fontSize: 11,
              textAnchor: "middle",
            })}
          />

          <AxisLeft
            left={margin.left}
            scale={probabilityYScale}
            tickFormat={(value) => (value * 100).toFixed(0) + "%"}
            tickLabelProps={() => ({
              fill: "#333",
              fontSize: 11,
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.25em",
            })}
          />

          <text
            x={width / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize={12}
            fill="#333"
          >
            Year
          </text>

          <text
            x={-height / 2}
            y={15}
            transform="rotate(-90)"
            textAnchor="middle"
            fontSize={12}
            fill="#333"
          >
            Probability
          </text>
        </svg>

        <Legend>
          <LegendItem>
            <LegendColor color="#d9534f" /> Probability of Shortfall
          </LegendItem>
        </Legend>
      </ChartContainer>

      {/* Toggle Button for Data Preview */}
      <ToggleButton onClick={() => setShowPreview(!showPreview)}>
        {showPreview ? "Hide Data" : "Show Data"}
      </ToggleButton>

      {/* Data Preview Table */}
      {showPreview && (
        <DataPreviewContainer>
          <DataTable>
            <thead>
              <tr>
                <TableHeader>Year</TableHeader>
                <TableHeader>Median Supply</TableHeader>
                <TableHeader>Median Demand</TableHeader>
                <TableHeader>5th Percentile</TableHeader>
                <TableHeader>95th Percentile</TableHeader>
                <TableHeader>Probability of Shortfall</TableHeader>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.year}>
                  <TableCell>{d.year}</TableCell>
                  <TableCell>{d.medianSupply.toFixed(2)}</TableCell>
                  <TableCell>{d.medianDemand.toFixed(2)}</TableCell>
                  <TableCell>{d.percentile5.toFixed(2)}</TableCell>
                  <TableCell>{d.percentile95.toFixed(2)}</TableCell>
                  <TableCell>{(d.probabilityOfShortfall * 100).toFixed(1)}%</TableCell>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </DataPreviewContainer>
      )}
    </div>
  );
};

export default MonteCarloResultsTab;
