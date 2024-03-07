// BarChart.tsx
import React, { useState } from 'react';
import { BarStack } from '@visx/shape';
import { Group } from '@visx/group';
import { Grid } from '@visx/grid';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from '@visx/vendor/d3-time-format';
import { useTooltip, useTooltipInPortal, defaultStyles } from '@visx/tooltip';
import { LegendOrdinal } from '@visx/legend';
import { localPoint } from '@visx/event';
import { BarStackProps } from '../types/public-types'
import { schemeCategory10 } from 'd3-scale-chromatic';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

export const purple3 = '#a44afe';
export const background = '#eaedff';
const defaultMargin = { top: 0, right: 0, bottom: 0, left: 40 }
const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white',
};

const parseDate = timeParse('%Y');
const format = timeFormat('%Y');
const formatDate = (date: string) => format(parseDate(date) as Date);

let tooltipTimeout: number;

export default function Example({
  width,
  height,
  inputData,
  events = false,
  margin = defaultMargin,
}: BarStackProps) {
  const { tooltipOpen, tooltipLeft, tooltipTop, tooltipData, hideTooltip, showTooltip } =
    useTooltip<any>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
  });

  // Convert dates to timestamps for the slider
  const years = inputData.map(d => +d.date); // Convert date strings to numbers
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  // Initialize the slider range to the full extent of dataset (convert years to numbers)
  const [yearRange, setYearRange] = useState([minYear, maxYear]);
  
  // Filter your data based on the slider's selected date range
  const filteredData = inputData.filter(d => {
    const year = +d.date; // Convert to number for comparison
    return year >= yearRange[0] && year <= yearRange[1];
  });

  // Adjustments for slider change to handle numbers (years)
  const handleSliderChange = (_event, newValue) => {
    setYearRange(newValue);
  };

  if (width < 10) return null;
  // bounds
  const xMax = width - margin.left;
  const yMax = height - margin.top - 100;
  const myKeys = Object.keys(filteredData[0]).filter(d => d !== 'date');

  const getCategory = (d) => d.date;

  const costTotals = filteredData.reduce((allTotals, currentDate) => {
    const totalCost = myKeys.reduce((dailyTotal, k) => {
      dailyTotal += Number(currentDate[k]);
      return dailyTotal;
    }, 0);
    allTotals.push(totalCost);
    return allTotals;
  }, [] as number[]);

  const categoryScale = scaleBand<string>({
    domain: filteredData.map(getCategory),
    padding: 0.2,
  });
  const valueScale = scaleLinear<number>({
    domain: [0, Math.max(...costTotals)],
    nice: true,
  });

  const colorScale = scaleOrdinal<string, string>().domain([]).range(schemeCategory10);

  categoryScale.rangeRound([0, xMax]);
  valueScale.range([yMax, 0]);

  return width < 10 ? null : (
    <div style={{ position: 'relative' }}>

      <Box width={300}>
        <Typography id="year-range-slider" gutterBottom>
          Year range
        </Typography>
        <Slider
          min={minYear}
          max={maxYear}
          value={yearRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          aria-labelledby="year-range-slider"
          // Optionally, you could format the label to add custom text
          valueLabelFormat={(x) => `${x}`}
        />
      </Box>

      <svg ref={containerRef} width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
        <Grid
          top={margin.top}
          left={margin.left}
          xScale={categoryScale}
          yScale={valueScale}
          width={xMax}
          height={yMax}
          stroke="black"
          strokeOpacity={0.1}
          xOffset={categoryScale.bandwidth() / 2}
        />
        <Group top={margin.top}>
          <BarStack
            data={filteredData}
            keys={myKeys}
            x={getCategory}
            xScale={categoryScale}
            yScale={valueScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${barStack.index}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    height={bar.height}
                    width={bar.width}
                    fill={bar.color}
                    onClick={() => {
                      if (events) alert(`clicked: ${JSON.stringify(bar)}`);
                    }}
                    onMouseLeave={() => {
                      tooltipTimeout = window.setTimeout(() => {
                        hideTooltip();
                      }, 300);
                    }}
                    onMouseMove={(event) => {
                      if (tooltipTimeout) clearTimeout(tooltipTimeout);
                      const eventSvgCoords = localPoint(event);
                      const left = bar.x + bar.width / 2;
                      showTooltip({
                        tooltipData: bar,
                        tooltipTop: eventSvgCoords?.y,
                        tooltipLeft: left,
                      });
                    }}
                  />
                )),
              )
            }
          </BarStack>
        </Group>
        <AxisLeft
          scale={valueScale}
          left={margin.left}
          tickStroke={purple3}
          stroke={purple3}
        />
        <AxisBottom
          top={yMax + margin.top}
          scale={categoryScale}
          tickFormat={formatDate}
          stroke={purple3}
          tickStroke={purple3}
          tickLabelProps={{
            fill: purple3,
            fontSize: 11,
            textAnchor: 'middle',
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: margin.top / 2 - 10,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '14px',
        }}
      >
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 15px 0 0" />
      </div>

      {tooltipOpen && tooltipData && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>
            <strong>{tooltipData.key}</strong>
          </div>
          <div>£{tooltipData.bar.data[tooltipData.key]}</div>
          <div>
            <small>{formatDate(getCategory(tooltipData.bar.data))}</small>
          </div>
        </TooltipInPortal>
      )}
    </div>
  );
}