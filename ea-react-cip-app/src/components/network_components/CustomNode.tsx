// CustomNode.tsx
import React from 'react';
import { Handle, Position, useStore } from 'reactflow';
import { CustomNodeProps } from '../../types/public-types';

const connectionNodeIdSelector = (state) => state.connectionNodeId;

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, onEdit }) => {

  const connectionNodeId = useStore(connectionNodeIdSelector);
  const { nodeName } = data;
  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;

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
          backgroundColor: isTarget ? '#F6A192' : data.nodeColour,
        }}
      >
        <span>{nodeName}</span>
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
};

export default CustomNode;