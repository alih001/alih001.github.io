// CustomNode.tsx
import React, { useState, useCallback } from 'react';
import { Handle, Position, useStore } from 'reactflow';
import { useData } from '../../contexts/useDataContext';
const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function CustomNode({ id, data, onEdit }) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const { nodeName } = data;

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
//   const label = isTarget ? 'Drop here' : 'Drag to connect';

  const handleContextMenu = (event) => {
    event.preventDefault()
    onEdit(id)
  }

  return (
    <div className="customNode">
      <div
        className="customNodeBody"
        onContextMenu={handleContextMenu}
        style={{
          borderStyle: isTarget ? 'dashed' : 'solid',
          backgroundColor: isTarget ? '#ffcce3' : data.nodeColour,
        }}
      >
        <span>{nodeName}</span>
        {/* If handles are conditionally rendered and not present initially, you need to update the node internals https://reactflow.dev/docs/api/hooks/use-update-node-internals/ */}
        {/* In this case we don't need to use useUpdateNodeInternals, since !isConnecting is true at the beginning and all handles are rendered initially. */}
        {!isConnecting && (
          <Handle className="customHandle" position={Position.Right} type="source" />
        )}

        <Handle
          className="customHandle"
          position={Position.Left}
          type="target"
          isConnectableStart={false}
        />
      </div>
    </div>
  );
}