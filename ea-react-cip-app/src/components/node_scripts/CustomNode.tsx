// CustomNode.tsx
import React, { useState, useCallback } from 'react';
import { Handle, Position, useStore } from 'reactflow';
import { useData } from '../../contexts/useDataContext';
const connectionNodeIdSelector = (state) => state.connectionNodeId;

export default function CustomNode({ id, data, onEdit }) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const { setNodes } = useData();
  const { nodeName } = data;

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
//   const label = isTarget ? 'Drop here' : 'Drag to connect';

  const handleContextMenu = (event) => {
    event.preventDefault()
    onEdit(id)
  }

//   const handleBlur = () => {
//     setIsEditing(false);
//     // Update the global state with the new nodeName
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === id ? { ...node, nodeName: editableName } : node
//       )
//     );
//   };

  return (
    <div className="customNode">
      <div
        className="customNodeBody"
        onContextMenu={handleContextMenu}
        style={{
          borderStyle: isTarget ? 'dashed' : 'solid',
          backgroundColor: isTarget ? '#ffcce3' : '#ccd9f6',
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