import React from 'react';
import { ArrowProps } from '../types/public-types'


const Arrow: React.FC<ArrowProps> = ({ startPoint, endPoint }) => {
  // Calculations for the SVG canvas size and position
  const minX = Math.min(startPoint.x, endPoint.x);
  const minY = Math.min(startPoint.y, endPoint.y);
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  // Adjusted start and end points relative to the SVG canvas
  const adjustedStart = { x: startPoint.x - minX, y: startPoint.y - minY };
  const adjustedEnd = { x: endPoint.x - minX, y: endPoint.y - minY };

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', left: minX, top: minY }}
    >
      <line
        x1={adjustedStart.x}
        y1={adjustedStart.y}
        x2={adjustedEnd.x}
        y2={adjustedEnd.y}
        stroke="#000"
        strokeWidth={2}
      />
      {/* Additional elements for arrowhead, if needed */}
    </svg>
  );
};

export default Arrow;
