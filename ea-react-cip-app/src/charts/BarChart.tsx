import React from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { schemeCategory10 } from 'd3-scale-chromatic';

const getWeirTypeColor = scaleOrdinal({
  domain: [],
  range: schemeCategory10,
});

const weirTypeData = (data: any[], rowReference: number) => {
  const counts = data.slice(1).reduce((acc, row) => {
    const weirType = row[rowReference];
    acc[weirType] = (acc[weirType] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(counts).map(key => ({
    letter: key,
    frequency: counts[key]
  }));
};

const frequencyAccessor = (d: { letter: string, frequency: number }) => d.frequency;

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export type PieProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  data: any[];
  rowReference: number;
};

const DashboardPieChart = ({
  width,
  height,
  margin = defaultMargin,
  data,
  rowReference,
}: PieProps) => {

  console.log(data)
  const processedData = weirTypeData(data, rowReference);
  getWeirTypeColor.domain(processedData.map(d => d.letter));

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;
  const pieSortValues = (a, b) => b - a;

  return (
    <svg width={width} height={height}>
      <Group top={top} left={left}>
        <Pie
          data={processedData}
          pieValue={frequencyAccessor}
          pieSortValues={pieSortValues}
          outerRadius={radius}
        >
          {(pie) => {
            return pie.arcs.map((arc, index) => {
              const { letter } = arc.data;
              const [centroidX, centroidY] = pie.path.centroid(arc);
              const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
              const arcPath = pie.path(arc);
              const arcFill = getWeirTypeColor(arc.data.letter);
              return (
                <g key={`arc-${letter}-${index}`}>
                  <path d={arcPath} fill={arcFill} />
                  {hasSpaceForLabel && (
                    <text
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fill="#ffffff"
                      fontSize={22}
                      textAnchor="middle"
                      pointerEvents="none"
                    >
                      {arc.data.letter}
                    </text>
                  )}
                </g>
              );
            });
          }}
        </Pie>
      </Group>
    </svg>
  );
}
export default DashboardPieChart;
