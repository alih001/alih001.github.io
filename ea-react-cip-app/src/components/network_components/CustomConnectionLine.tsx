// CustomConnectionLine.tsx
import React from 'react';
import { getBezierPath } from 'reactflow';
import { CustomConnectionProps } from '../../types/public-types';

const CustomConnectionLine: React.FC<CustomConnectionProps> = ({  fromX, fromY, toX, toY, sourcePos, targetPos, connectionLineStyle }) => {
  
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: toX,
    targetY: toY,

  });

  return (
    <g>
      <path style={connectionLineStyle} fill="none" d={edgePath} />
      <circle cx={toX} cy={toY} fill="black" r={3} stroke="black" strokeWidth={1.5} />
    </g>
  );
}

export default CustomConnectionLine;