import { useCallback } from 'react';
import { useStore, getBezierPath } from 'reactflow';
import { getEdgeParams } from './utils.tsx';
import { ConnectionPath } from '../../types/public-types.ts';

interface FloatingEdgeProps extends ConnectionPath {
  strength?: "low" | "medium" | "high";
  onEdgeContextMenu?: (event: React.MouseEvent<SVGPathElement>, edgeId: string) => void;
}

const getStrengthStyle = (strength: "low" | "medium" | "high") => {
  switch (strength) {
    case "low":
      return { strokeWidth: 2, stroke: "#ccc" };
    case "high":
      return { strokeWidth: 5, stroke: "red" };
    case "medium":
    default:
      return { strokeWidth: 3, stroke: "black" };
  }
};

const FloatingEdge: React.FC<FloatingEdgeProps> = ({
  id,
  source,
  target,
  markerEnd,
  style,
  strength = "medium",
  onEdgeContextMenu,
}) => {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const strengthStyle = getStrengthStyle(strength);

  console.log("Rendering FloatingEdge", id, "with strength", strength);


  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={{ ...style, ...strengthStyle }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (onEdgeContextMenu) {
          onEdgeContextMenu(e, id);
        }
      }}
    />
  );
};

export default FloatingEdge;
