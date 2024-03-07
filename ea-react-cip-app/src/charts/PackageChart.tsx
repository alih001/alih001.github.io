import React, { useState } from 'react';
import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';
import { timeParse, timeFormat } from '@visx/vendor/d3-time-format';
import { BarGroupProps } from '../types/public-types';
import { schemeCategory10 } from 'd3-scale-chromatic';
import Select from 'react-select'

export const green = '#e5fd3d';
export const background = '#612efb';

const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };

const parseDate = timeParse('%Y');
const format = timeFormat('%Y');
const formatDate = (date: string) => format(parseDate(date) as Date);

export default function PackageChart({
  width,
  height,
  inputData,
  events = false,
  margin = defaultMargin,
}: BarGroupProps) {

  const initialKey = Object.keys(inputData[0])[1];
  const [selectedKey, setSelectedKey] = useState(initialKey);

  const selectOptions = Object.keys(inputData[0]).filter(k => k !== 'date').map(key => ({
    value: key,
    label: key,
  }));

  const handleSelectChange = (selectedOption) => {
    setSelectedKey(selectedOption.value);
  };

  // Filter keys based on the selectedKey state
  const keys = [selectedKey];

  // bounds
  const getCategory = (d) => d.date;
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  // const keys = Object.keys(inputData[0]).filter(d => d !== 'date');

  const dateScale = scaleBand<string>({
    domain: inputData.map(getCategory),
    padding: 0.2,
  });
  const cityScale = scaleBand<string>({
    domain: keys,
    padding: 0.1,
  });
  const tempScale = scaleLinear<number>({
    domain: [0, Math.max(...inputData.map((d) => Math.max(...keys.map((key) => Number(d[key])))))],
  });
  const colorScale = scaleOrdinal<string, string>().domain([]).range(schemeCategory10);
  
  // update scale output dimensions
  dateScale.rangeRound([0, xMax]);
  cityScale.rangeRound([0, dateScale.bandwidth()]);
  tempScale.range([yMax, 0]);

  return width < 10 ? null : (
    <div>
      <Select 
        value={selectOptions.find(option => option.value === selectedKey)} 
        onChange={handleSelectChange}
        options={selectOptions}
      />
      {/* {Object.keys(inputData[0]).filter(k => k !== 'date').map(key => (
        <option key={key} value={key}>
          {key}
        </option>
      ))} */}
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={background} rx={14} />
      <Group top={margin.top} left={margin.left}>
        <BarGroup
          data={inputData}
          keys={keys}
          height={yMax}
          x0={getCategory}
          x0Scale={dateScale}
          x1Scale={cityScale}
          yScale={tempScale}
          color={colorScale}
        >
          {(barGroups) =>
            barGroups.map((barGroup) => (
              <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                {barGroup.bars.map((bar) => (
                  <rect
                    key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={bar.color}
                    rx={4}
                    onClick={() => {
                      if (!events) return;
                      const { key, value } = bar;
                      alert(JSON.stringify({ key, value }));
                    }}
                  />
                ))}
              </Group>
            ))
          }
        </BarGroup>
      </Group>
      <AxisBottom
        top={yMax + margin.top}
        tickFormat={formatDate}
        scale={dateScale}
        stroke={green}
        tickStroke={green}
        hideAxisLine
        tickLabelProps={{
          fill: green,
          fontSize: 11,
          textAnchor: 'middle',
        }}
      />
    </svg>
    </div>
  );
}